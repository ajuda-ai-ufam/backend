export class CreatePrismaFactory {
  static build(props) {
    return {
      user_id: 1,
      description: 'Create a New Strudent - Teste',
      enrollment: '22222222',
      course_id: 2,
      contact_email: 'estudante@icomp.ufam.edu.br',
      whatsapp: '92912345678',
      linkedin: 'linkedin.com/in/estudante-ufam/',
      ...props,
    };
  }
}

export class FindStudentFactory {
  static build(props) {
    return {
      user_id: 1,
      description: '',
      enrollment: '22222222',
      course_id: 1,
      course: {
        id: 1,
        name: 'Engenharia de Software',
      },
      contact_email: 'estudante@icomp.ufam.edu.br',
      whatsapp: null,
      linkedin: null,
      user: {
        id: 7,
        email: 'estudante@icomp.ufam.edu.br',
        name: 'Fulando de Menezes',
        is_verified: true,
        type_user_id: 1,
        updated_at: '2023-09-06T17:45:58.769Z',
        created_at: '2023-09-06T17:45:58.769Z',
      },
      ...props,
    };
  }
}

export class GetMonitorAvailability {
  static build(props) {
    return {
      id: 2,
      status: 'Disponível',
      endDate: null,
      student: {
        id: 6,
        name: 'Estudante',
        email: 'estudante@icomp.ufam.edu.br',
        contactEmail: 'estudante@icomp.ufam.edu.br',
        description: '',
        enrollment: '22222222',
        whatsapp: null,
        linkedin: null,
        courseId: 1,
        course: {
          id: 1,
          name: 'Engenharia de Software',
        },
      },
      subject: {
        id: 2,
        code: 'ICC015',
        name: 'Desafios De Programação I',
        course: {
          id: 2,
          code: 'IE08',
          name: 'Ciência da Computação',
        },
      },
      responsible: {
        id: 2,
        name: 'Professor',
        email: 'professor@icomp.ufam.edu.br',
      },
      monitorSettings: null,
      availability: [
        {
          id: 1,
          week_day: 0,
          start: '00:00',
          end: '23:00',
        },
        {
          id: 2,
          week_day: 1,
          start: '00:00',
          end: '23:00',
        },
        {
          id: 3,
          week_day: 2,
          start: '00:00',
          end: '23:00',
        },
        {
          id: 4,
          week_day: 3,
          start: '00:00',
          end: '23:00',
        },
        {
          id: 5,
          week_day: 4,
          start: '00:00',
          end: '23:00',
        },
        {
          id: 6,
          week_day: 5,
          start: '00:00',
          end: '23:00',
        },
        {
          id: 7,
          week_day: 6,
          start: '00:00',
          end: '23:00',
        },
      ],
      ...props,
    };
  }
}
