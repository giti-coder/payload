
// Example Collection - For reference only, this must be added to payload.config.ts to be used.
import {CollectionConfig} from '../../../src/collections/config/types';

const Collection2: CollectionConfig = {
  slug: 'collection2',
  admin: {
    useAsTitle: 'someField2',
  },
  fields: [
    {
      name: 'someField2',
      type: 'text',
      localized: true,
    },
    {
      name: 'references',
      type: 'relationship',
      relationTo: 'posts',
      maxDepth: 1,
    },
  ],
};

export default Collection2;
