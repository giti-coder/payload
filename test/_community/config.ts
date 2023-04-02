import { buildConfig } from '../buildConfig';
import { PostsCollection, postsSlug } from './collections/Posts';
import { devUser } from '../credentials';
import Collection2 from './collections/Collection2';

export default buildConfig({
  // ...extend config here
  collections: [
    PostsCollection,
    Collection2,
    // ...add more collections here
  ],

  localization: {
    locales: [
      'en',
      'es',
      'de',
    ],
    defaultLocale: 'es',
    fallback: true,
  },

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
