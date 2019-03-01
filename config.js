module.exports = {
  PORT: process.env.PORT || 3001,
  APIKEY: process.env.APIKEY || "d53c776d456b1f05d7b63d63f621e2e7",
  REDISPORT:  process.env.REDISPORT || "6379",
  REDISHOST:  process.env.REDISHOST || "redis",
  REDIS_URL: process.env.REDIS_URL || "redis://redis:6379",
  CITIES: [
    {
      name: "Santiago (CL)",
      latitude: -33.435974,
      longitude: -70.67286
    },
    {
      name:  'Zurich (CH)',
      latitude :47.37861,
      longitude: 8.54,
    },
    {
      name: 'Auckland (NZ)',
      latitude: -36.85,
      longitude: 174.78333,
    },
    {
      name: 'Sydney (AU)',
      latitude: -33.868,
      longitude: 151.21,
    },
    {
      name: 'Londres (UK)',
      latitude: -33.444283,
      longitude: -70.6482,
    },
    {
      name: 'Georgia (USA)',
      latitude: 33,
      longitude: -83.5,
    }
  ]
};
