export const prismaServiceMock = {
  student: {
    create: jest.fn(),
  },
};

export const createStudentData = (
  userId: number,
  enrollment: string,
  courseId: number,
  contactEmail: string,
) => ({
  user_id: userId,
  description: 'Create a New Strudent - Teste',
  enrollment: enrollment,
  course_id: courseId,
  contact_email: contactEmail,
  whatsapp: '92912345678',
  linkedin: 'linkedin.com/in/estudante-ufam/',
});
