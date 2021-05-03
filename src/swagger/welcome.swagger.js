export const welcome = {

  '/': {
    get: {
      tags: [
        'welcome',
      ],
      summary: 'Welcome to Online Ticketing and Live streaming system easy for concert to management',
      description: 'Welcome page for Online ticketing and Live streaming System',
      produces: [
        'application/json',
      ],
      responses: {
        200: {
          description: 'successful operation',
        },
        400: {
          description: 'Invalid status value',
        },
      },
    },
  },
};
