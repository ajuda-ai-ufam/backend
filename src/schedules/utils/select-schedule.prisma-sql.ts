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
  monitor_settings: {
    select: { id: true, preferential_place: true, is_active: true },
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
      MonitorSettings: {
        select: { id: true, preferential_place: true, is_active: true },
        where: { is_active: true },
      },
    },
  },
};

export default scheduleSelectPrismaSQL;
