export const API_CONFIG = {
  BASE_URL: 'http://bolor.me/h2h/api',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PARCELS: '/parcels',
    DRIVER: {
      ASSIGNMENTS: '/driver/assignments',
      LOCATION: '/driver/location',
      PARCEL: '/driver/parcel'
    },
    ADMIN: {
      STATS: '/admin/stats',
      DRIVERS: '/admin/drivers',
      ASSIGN_DRIVER: '/admin/assign-driver'
    }
  }
};
