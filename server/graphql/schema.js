import { makeExecutableSchema } from '@graphql-tools/schema';
import { resolvers } from './resolvers.js';

const typeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    email: String!
  }

  type Course {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    image: String
    instructor: User
    rating: Float
    enrolledCount: Int
    createdAt: String
    updatedAt: String
  }

  type Query {
    courses: [Course!]!
    course(id: ID!): Course
    searchCourses(searchTerm: String!): [Course!]!
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
