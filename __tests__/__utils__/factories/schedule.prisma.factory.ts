import { ScheduleStatus } from 'src/schedules/utils/schedules.enum';

export class SchedulePrismaFactory {
  static build(props) {
    return {
      id: 1,
      id_status: ScheduleStatus.CONFIRMED,
      status: {
        id: ScheduleStatus.CONFIRMED,
        status: 'Confirmada',
      },
      start: new Date('2023-01-20T12:20:00.000Z'),
      end: new Date('2023-01-20T13:20:00.000Z'),
      description: '',
      student_id: 1,
      student: {
        enrollment: '44444444',
        user: {
          id: 1,
          name: 'Estudante',
          email: 'estudante@icomp.ufam.edu.br',
        },
      },
      ScheduleTopics: null,
      monitor_settings: { id: 1, preferential_place: 'Casa', is_active: false },
      monitor: {
        id: 1,
        student_id: 2,
        student: {
          enrollment: '44444444',
          user: {
            id: 2,
            name: 'Monitor',
            email: 'monitor@icomp.ufam.edu.br',
          },
        },
        subject: {
          id: 1,
          name: 'Desenvolvimento De Aplicativos Para Dispositivos Móveis',
          course: {
            id: 1,
            name: 'Ciência da computação',
          },
        },
        responsible_professor: {
          user: {
            id: 3,
            name: 'Professor',
            email: 'professor@icomp.ufam.edu.br',
          },
        },
        MonitorSettings: [
          { id: 1, preferential_place: 'Casa', is_active: false },
        ],
      },
      ...props,
    };
  }
}
