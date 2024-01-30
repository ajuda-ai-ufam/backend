export const prismaServiceMock = {
    scheduleTopics: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };
  export const expectedFindMany = (token: string, skip: number, take: number) => ({
    orderBy: {
      token: 'asc',
    },
    where: {
      token: { contains: token},
    },
    skip,
    take,
  });
  
  export const expectedCount = (token: string) => ({
    where: {
      token: { contains: token },
    },
  });