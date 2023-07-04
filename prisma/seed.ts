import { PrismaClient } from '@prisma/client';
import * as csvToJson from 'convert-csv-to-json';

const subjects_es = csvToJson
  .fieldDelimiter(';')
  .getJsonFromCsv('prisma/disciplinas_es.csv');

const subjects_cc = csvToJson
  .fieldDelimiter(';')
  .getJsonFromCsv('prisma/disciplinas_cc.csv');

const subjects_ec = csvToJson
  .fieldDelimiter(';')
  .getJsonFromCsv('prisma/disciplinas_ec.csv');

let professores = [];
try {
  professores = csvToJson
    .fieldDelimiter(';')
    .getJsonFromCsv('prisma/professores.csv');
} catch (error) {
  console.warn('professores.csv not found');
}

let coordenadores = [];
try {
  coordenadores = csvToJson
    .fieldDelimiter(';')
    .getJsonFromCsv('prisma/coordenadores.csv');
} catch (error) {
  console.warn('coordenadores.csv not found');
}

const courses = [
  { id: 1, name: 'Engenharia de Software', code: 'IE17' },
  { id: 2, name: 'Ciência da Computação', code: 'IE08' },
  { id: 3, name: 'Engenharia da Computação', code: 'FT05' },
  { id: 4, name: 'Outros', code: '0000' },
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
  { status: 'Finalizada', id: 3 },
];

const status_schedule_monitoring = [
  { status: 'Aguardando aprovação do monitor', id: 1 },
  { status: 'Confirmada', id: 2 },
  { status: 'Cancelada', id: 3 },
  { status: 'Realizada', id: 4 },
  { status: 'Não realizada', id: 5 },
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
  console.log('Courses seeded.');

  const formatSubjectName = (name: string) =>
    name
      .split(' ')
      .map((word) =>
        word === 'II' || word === 'III' || word === 'IV' || word === 'VI'
          ? word
          : (word[0]?.toUpperCase() || '') + word.slice(1).toLowerCase(),
      )
      .join(' ');

  for (const subject of subjects_es) {
    subject.name = formatSubjectName(subject.name);
    await prisma.subject.upsert({
      create: { ...subject, course_id: 1 },
      update: { ...subject, course_id: 1 },
      where: { code: subject.code },
    });
  }
  console.log('ES subjects seeded.');

  for (const subject of subjects_cc) {
    subject.name = formatSubjectName(subject.name);
    await prisma.subject.upsert({
      create: { ...subject, course_id: 2 },
      update: { ...subject, course_id: 2 },
      where: { code: subject.code },
    });
  }
  console.log('CC subjects seeded.');

  for (const subject of subjects_ec) {
    subject.name = formatSubjectName(subject.name);
    await prisma.subject.upsert({
      create: { ...subject, course_id: 3 },
      update: { ...subject, course_id: 3 },
      where: { code: subject.code },
    });
  }
  console.log('EC subjects seeded.');

  for (const type of type_user) {
    await prisma.typeUser.upsert({
      create: type,
      update: {},
      where: { id: type.id },
    });
  }
  console.log('User types seeded.');

  for (const type of type_code) {
    await prisma.typeCode.upsert({
      create: type,
      update: {},
      where: { id: type.id },
    });
  }
  console.log('Code types seeded.');

  for (const status of status_monitoring) {
    await prisma.statusMonitoring.upsert({
      create: status,
      update: { status: status.status },
      where: { id: status.id },
    });
  }
  console.log('Monitor status seeded.');

  for (const status of status_schedule_monitoring) {
    await prisma.statusScheduleMonitoring.upsert({
      create: status,
      update: { status: status.status },
      where: { id: status.id },
    });
  }
  console.log('Schedule monitoring status seeded.');

  for (const status of status_responsability) {
    await prisma.statusResponsability.upsert({
      create: status,
      update: { status: status.status },
      where: { id: status.id },
    });
  }
  console.log('Subject responsability status seeded.');

  for (const professor of professores) {
    const user = await prisma.user.upsert({
      where: { email: professor.email },
      create: {
        email: professor.email,
        name: professor.name,
        password: professor.password,
        updated_at: new Date(professor.updated_at),
        type_user: {
          connect: { id: 2 },
        },
        is_verified: true,
      },
      update: {},
    });

    await prisma.teacher.upsert({
      where: { user_id: user.id },
      create: {
        user_id: user.id,
      },
      update: {},
    });
    const subject = await prisma.subject.findUnique({
      where: { code: professor.discipline },
    });

    if (subject) {
      await prisma.subjectResponsability.create({
        data: {
          professor: { connect: { user_id: user.id } },
          subject: { connect: { id: subject.id } },
          status: {
            connect: { id: 2 },
          },
        },
      });
    } else {
      console.warn(`Discipline with code ${professor.discipline} not found.`);
    }
  }
  console.log('Teachers seeded');

  for (const coordinator of coordenadores) {
    const user = await prisma.user.upsert({
      where: { email: coordinator.email },
      create: {
        email: coordinator.email,
        name: coordinator.name,
        password: coordinator.password,
        updated_at: new Date(coordinator.updated_at),
        type_user: {
          connect: { id: 3 },
        },
        is_verified: true,
      },
      update: {},
    });

    await prisma.coordinator.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
      },
      update: {},
    });
  }
  console.log('Coordinators seeded.');
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
