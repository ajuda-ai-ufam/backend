import { PrismaClient } from '@prisma/client';

const courses = [
  { name: 'Engenharia de Software', code: 'IE17' },
  { name: 'Ciência da Computação', code: 'IE08' },
];

const subjects = [
  { name: 'INTRODUÇAO A PROGRAMAÇÃO', code: 'ICC020', course_id: 1 },
  { name: 'MATEMÁTICA DISCRETA', code: 'ICC120', course_id: 1 },
  { name: 'ALGORITMOS E ESTRUTURAS DE DADOS I ', code: 'ICC002', course_id: 1 },
  { name: 'PROJETO E ANÁLISE DE ALGORITMOS ', code: 'ICC006', course_id: 1 },
  { name: 'INTRODUÇÃO À COMPUTAÇÃO', code: 'ICC001', course_id: 2 },
  { name: 'LINGUAGENS FORMAIS E AUTÔMATOS', code: 'ICC040', course_id: 2 },
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
  for (const subject of subjects) {
    await prisma.subject.upsert({
      create: subject,
      update: {},
      where: { code: subject.code },
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
