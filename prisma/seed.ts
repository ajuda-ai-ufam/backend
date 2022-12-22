import { PrismaClient } from '@prisma/client';
import * as csvToJson from 'convert-csv-to-json';

const subjects_es = csvToJson
  .fieldDelimiter(',')
  .getJsonFromCsv('prisma/disciplinas_es.csv');

const subjects_cc = csvToJson
  .fieldDelimiter(',')
  .getJsonFromCsv('prisma/disciplinas_cc.csv');

const courses = [
  { id: 1, name: 'Engenharia de Software', code: 'IE17' },
  { id: 2, name: 'Ciência da Computação', code: 'IE08' },
];

const status_monitoring = [
  { status: 'Pendente', id: 1 },
  { status: 'Aprovada', id: 2 },
  { status: 'Disponível', id: 3 },
  { status: 'Finalizada', id: 4 },
  { status: 'Rejeitada', id: 5 },
];

const status_responsability = [
  { status: 'Pendente', id: 1 },
  { status: 'Aprovado', id: 2 },
];

const status_schedule_monitoring = [
  { status: 'Aguardando aprovação do monitor', id: 1 },
  { status: 'Confirmada', id: 2 },
  { status: 'Cancelada', id: 3 },
  { status: 'Vencida', id: 4 },
];

const type_user = [
  { type: 'Student', id: 1 },
  { type: 'Teacher', id: 2 },
  { type: 'Coordinator', id: 3 },
];

const type_code = [
  { type: 'Login', id: 1 },
  { type: 'Password', id: 2 },
];

const prisma = new PrismaClient();
async function main() {
  for (const course of courses) {
    await prisma.course.upsert({
      create: course,
      update: {},
      where: { code: course.code },
    });
  }

  for (const subject of subjects_es) {
    subject.name = subject.name
      .split(' ')
      .map((word) => {
        if (word.length > 2)
          return word[0].toUpperCase() + word.slice(1).toLowerCase();
        else return word.toLowerCase();
      })
      .join(' ');
    await prisma.subject.upsert({
      create: { ...subject, course_id: 1 },
      update: { ...subject, course_id: 1 },
      where: { code: subject.code },
    });
  }

  for (const subject of subjects_cc) {
    subject.name = subject.name
      .split(' ')
      .map((word) => {
        if (word.length > 2)
          return word[0].toUpperCase() + word.slice(1).toLowerCase();
        else return word.toLowerCase();
      })
      .join(' ');
    await prisma.subject.upsert({
      create: { ...subject, course_id: 2 },
      update: { ...subject, course_id: 2 },
      where: { code: subject.code },
    });
  }

  for (const type of type_user) {
    await prisma.typeUser.upsert({
      create: type,
      update: {},
      where: { id: type.id },
    });
  }

  for (const type of type_code) {
    await prisma.typeCode.upsert({
      create: type,
      update: {},
      where: { id: type.id },
    });
  }

  for (const status of status_monitoring) {
    await prisma.statusMonitoring.upsert({
      create: status,
      update: { status: status.status },
      where: { id: status.id },
    });
  }

  for (const status of status_schedule_monitoring) {
    await prisma.statusScheduleMonitoring.upsert({
      create: status,
      update: { status: status.status },
      where: { id: status.id },
    });
  }

  for (const status of status_responsability) {
    await prisma.statusResponsability.upsert({
      create: status,
      update: { status: status.status },
      where: { id: status.id },
    });
  }
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
