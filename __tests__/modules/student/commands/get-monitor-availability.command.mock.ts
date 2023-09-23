export const prismaServiceMock = {
  availableTimes: {
    findMany: jest.fn(),
  },
};

export const getMonitorAvailabilityExpectedCall = (monitor_id: number) => ({
  where: { monitor_id },
  orderBy: { week_day: 'asc' },
});
