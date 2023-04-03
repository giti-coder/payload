
// Example Collection - For reference only, this must be added to payload.config.ts to be used.
import slugify from 'slugify';
import { CollectionConfig } from '../../../src/collections/config/types';




const Slugged: CollectionConfig = {
  slug: 'slugged',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'createdAt', 'updatedAt'],
    group: 'Examples',
  },
  versions: {
    drafts: true,
  },

  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      localized: true,
      required: true,
      validate: (val) => {
        return RegExp('^[a-z0-9]+(?:-[a-z0-9]+)*$').test(val) ? true : 'Invalid slug.';
      },
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            console.log('slugify', slugify(data.title));
            console.log("Data", data);
            if (!value && data.title) {
              return slugify(data.title);
            }
          },
        ],
      },
    },
  ],
};

export default Slugged;
