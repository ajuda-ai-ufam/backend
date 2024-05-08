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
  
  const scheduleSelectExternalPrismaSQL = {
    id: true,
    start: true,
    end: true,
    student_id: true,
    student_name: true,
    description: true,
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
  
  export default scheduleSelectExternalPrismaSQL;
  