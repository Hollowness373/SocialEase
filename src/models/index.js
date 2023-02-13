// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Story, User, Post } = initSchema(schema);

export {
  Story,
  User,
  Post
};