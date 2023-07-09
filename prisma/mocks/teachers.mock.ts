import { SubjectResponsabilityStatus } from 'src/subject/utils/subject.enum';

export const teachers = [
  {
    userData: {
      id: 2,
      email: 'juan.professor@icomp.ufam.edu.br',
      name: 'Juan Colonna',
      password: '$2b$10$tD2DAHmqPIoGNmYxmD.8Zu/0L6GMqUN3q0S31SPnpsvDjXvTES6.2',
      is_verified: true,
      type_user_id: 2,
    },
    responsabilities: [
      {
        id: 1,
        professor_id: 2,
        subject_id: 1,
        id_status: SubjectResponsabilityStatus.APPROVED,
      },
      {
        id: 2,
        professor_id: 2,
        subject_id: 2,
        id_status: SubjectResponsabilityStatus.APPROVED,
      },
    ],
  },
  {
    userData: {
      id: 3,
      email: 'andre.professor@icomp.ufam.edu.br',
      name: 'André Carvalho',
      password: '$2b$10$tD2DAHmqPIoGNmYxmD.8Zu/0L6GMqUN3q0S31SPnpsvDjXvTES6.2',
      is_verified: true,
      type_user_id: 2,
    },
    responsabilities: [
      {
        id: 3,
        professor_id: 3,
        subject_id: 1,
        id_status: SubjectResponsabilityStatus.APPROVED,
      },
    ],
  },
  {
    userData: {
      id: 4,
      email: 'nakamura.professor@icomp.ufam.edu.br',
      name: 'Eduardo Nakamura',
      password: '$2b$10$tD2DAHmqPIoGNmYxmD.8Zu/0L6GMqUN3q0S31SPnpsvDjXvTES6.2',
      is_verified: true,
      type_user_id: 2,
    },
    responsabilities: [],
  },
  {
    userData: {
      id: 5,
      email: 'tayana.professor@icomp.ufam.edu.br',
      name: 'Tayana Conte',
      password: '$2b$10$tD2DAHmqPIoGNmYxmD.8Zu/0L6GMqUN3q0S31SPnpsvDjXvTES6.2',
      is_verified: true,
      type_user_id: 2,
    },
    responsabilities: [],
  },
];
