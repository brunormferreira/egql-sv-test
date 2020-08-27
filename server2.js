const app = require('express')();
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// GraphQL schema
const schema = buildSchema(`
  type User {
    id: ID
    name: String
    repo: String
    age: Int
  }
  type Query {
    user(id: ID!): User
    users: [User]
  }
  type Mutation {
    createUser(name: String!, repo: String!, age: Int!): User
  }
`);

const providers = {
  users: [],
};

// resolver
let id = 0;

const resolvers = {
  user({ id }) {
    return providers.users.find((item) => item.id === Number(id));
  },
  users() {
    return providers.users;
  },
  createUser({ name, repo, age }) {
    const user = {
      id: id++,
      name,
      repo,
      age,
    };

    providers.users.push(user);

    return user;
  },
};

// Create an express server and a GraphQL endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

app.listen(4000, () =>
  console.log('Express GraphQL Server Now Running On localhost:4000/graphql')
);

// https://blog.rocketseat.com.br/iniciando-graphql-nodejs-expressjs/