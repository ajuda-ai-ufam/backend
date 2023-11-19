import { PrismaClient } from '@prisma/client';
import { coordinator } from './mocks/coordinator.mock';
import { monitors } from './mocks/monitors.mock';
import { schedules } from './mocks/schedules.mock';
import { students } from './mocks/students.mock';
import { teachers } from './mocks/teachers.mock';

const prisma = new PrismaClient();
async function main() {
  await populateCoordinator();

  await populateTeachers();

  await populateStudents();

  await populateMonitors();

  await populateSchedules();
}

async function populateCoordinator() {
  await prisma.user.upsert({
    create: coordinator.userData,
    update: {},
    where: { email: coordinator.userData.email },
  });

  await prisma.coordinator.upsert({
    create: {
      id: coordinator.userData.id,
      department_id: coordinator.departament_id,
    },
    update: {},
    where: { id: coordinator.userData.id },
  });

  console.log('Coordinator populated.');
}

async function populateStudents() {
  for (const student of students) {
    await prisma.user.upsert({
      create: student.userData,
      update: {},
      where: { email: student.userData.email },
    });

    await prisma.student.upsert({
      create: {
        user_id: student.studentData.user_id,
        description: student.studentData.description,
        enrollment: student.studentData.enrollment,
        course_id: student.studentData.course_id,
        contact_email: student.studentData.contact_email,
      },
      update: {},
      where: { user_id: student.studentData.user_id },
    });
  }

  console.log('Students populated.');
}

async function populateTeachers() {
  for (const teacher of teachers) {
    await prisma.user.upsert({
      create: teacher.userData,
      update: {},
      where: { email: teacher.userData.email },
    });

    await prisma.teacher.upsert({
      create: {
        user_id: teacher.userData.id,
        siape: teacher.siape,
        department_id: teacher.department_id,
      },
      update: {},
      where: { user_id: teacher.userData.id },
    });

    for (const responsability of teacher.responsabilities) {
      await prisma.subjectResponsability.upsert({
        create: responsability,
        update: {},
        where: {
          id: responsability.id,
        },
      });
    }
  }

  console.log('Teachers populated.');
}

async function populateMonitors() {
  for (const monitor of monitors) {
    await prisma.monitor.upsert({
      create: monitor.monitorData,
      update: {},
      where: {
        id: monitor.monitorData.id,
      },
    });

    for (const time of monitor.availableTimes) {
      await prisma.availableTimes.upsert({
        create: time,
        update: {},
        where: {
          id: time.id,
        },
      });
    }
  }

  console.log('Monitors populated.');
}

async function populateSchedules() {
  for (const schedule of schedules) {
    await prisma.scheduleMonitoring.upsert({
      create: schedule,
      update: {},
      where: {
        id: schedule.id,
      },
    });
  }

  console.log('Schedules populated.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
