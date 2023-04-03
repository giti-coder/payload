import { buildConfig } from '../buildConfig';
import { devUser } from '../credentials';
import Slugged from './collections/Slugged';

export default buildConfig({
  // ...extend config here
  collections: [
    Slugged,
    // ...add more collections here
  ],

  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    });
  },
});
