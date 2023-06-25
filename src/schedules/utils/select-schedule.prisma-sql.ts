const userSelect = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

const studentSelect = {
  student: {
    select: {
      enrollment: true,
      ...userSelect,
    },
  },
};

const scheduleSelectPrismaSQL = {
  id: true,
  id_status: true,
  start: true,
  end: true,
  description: true,
  ...studentSelect,
  ScheduleTopics: {
    select: {
      id: true,
      name: true,
    },
  },
  monitor: {
    select: {
      id: true,
      ...studentSelect,
      subject: {
        select: {
          id: true,
          name: true,
          course: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      responsible_professor: {
        select: { ...userSelect },
      },
    },
  },
};

export default scheduleSelectPrismaSQL;
