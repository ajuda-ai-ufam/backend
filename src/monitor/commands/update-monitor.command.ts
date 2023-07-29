import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  AvailabilityWeekDay,
  UpdateMonitorDTO,
} from '../dto/update-monitor.dto';
import {
  EditMonitorBodyMissingFieldsException,
  EmptyAvailabilityException,
  InvalidMonitoringStatusException,
  InvalidPreferentialPlaceException,
  MonitoringNotFoundException,
  UserLoggedNotResponsableForMonitoringException,
} from '../utils/exceptions';
import { MonitorStatus } from '../utils/monitor.enum';

@Injectable()
export class UpdateMonitorCommand {
  allowedMonitorStatuses = [MonitorStatus.APPROVED, MonitorStatus.AVAILABLE];

  constructor(private readonly prisma: PrismaService) {}

  async execute(
    monitorId: number,
    tokenUserId: number,
    preferentialPlace: string,
    availability: AvailabilityWeekDay[],
  ): Promise<UpdateMonitorDTO> {
    if (preferentialPlace === undefined && availability == undefined)
      throw new EditMonitorBodyMissingFieldsException();

    if (availability !== undefined && !availability.length) {
      throw new EmptyAvailabilityException();
    }

    if (preferentialPlace === '') {
      throw new InvalidPreferentialPlaceException();
    }

    const monitoring = await this.prisma.monitor.findFirst({
      where: {
        id: monitorId,
      },
      include: {
        status: true,
      },
    });

    if (!monitoring) throw new MonitoringNotFoundException();

    if (monitoring.student_id != tokenUserId)
      throw new UserLoggedNotResponsableForMonitoringException();

    if (
      !this.allowedMonitorStatuses.find(
        (status) => status === monitoring.id_status,
      )
    ) {
      throw new InvalidMonitoringStatusException(monitoring.status.status);
    }

    const monitorSettings = await this.getOrUpdateMonitorSettings(
      preferentialPlace,
      monitorId,
    );

    const monitorAvailability = await this.getOrUpdateAvailableTimes(
      availability,
      monitorId,
    );
    console.log('monitorAvailability', monitorAvailability);

    if (monitorSettings && monitorAvailability) {
      await this.prisma.monitor.update({
        where: { id: monitorId },
        data: {
          id_status: MonitorStatus.AVAILABLE,
        },
      });
    }

    return {
      preferentialPlace,
      availability,
    };
  }

  async getOrUpdateMonitorSettings(
    preferentialPlace: string,
    monitorId: number,
  ) {
    if (preferentialPlace === undefined) {
      return this.prisma.monitorSettings.findFirst({
        where: { monitor_id: monitorId, is_active: true },
      });
    }

    const result = await this.prisma.$transaction([
      this.prisma.monitorSettings.updateMany({
        where: { monitor_id: monitorId, is_active: true },
        data: {
          is_active: false,
        },
      }),
      this.prisma.monitorSettings.create({
        data: {
          monitor_id: monitorId,
          preferential_place: preferentialPlace,
          is_active: true,
        },
      }),
    ]);
    return result[1];
  }

  async getOrUpdateAvailableTimes(
    availability: AvailabilityWeekDay[] | undefined,
    monitorId: number,
  ) {
    if (availability === undefined) {
      return this.prisma.availableTimes.findFirst({
        where: { monitor_id: monitorId },
      });
    }

    const formattedAvailableTimes = [];
    availability.forEach((day) =>
      day.hours.forEach((hour) =>
        formattedAvailableTimes.push({
          monitor_id: monitorId,
          week_day: day.weekDay,
          start: hour.start,
          end: hour.end,
        }),
      ),
    );

    const result = await this.prisma.$transaction([
      this.prisma.availableTimes.deleteMany({
        where: { monitor_id: monitorId },
      }),
      this.prisma.availableTimes.createMany({
        data: formattedAvailableTimes,
      }),
    ]);

    return result[1];
  }
}
