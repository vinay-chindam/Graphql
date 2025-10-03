import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

const port = 4000;

async function startServer() {
    const app = express();

    const typeDefs = `
  type Todo{
    id: ID!
    title: String!
    completed: Boolean!
    user:User!
  }

  type User{
  id: ID!
  name: String!
  username: String!
  email: String!
  todos: [Todo!]!
  
  }
    
    
    type Query {
        getUser(id:ID!):User
        getTodos: [Todo!]!
        getUsers:[User!]!
    }
  `


        ;

    const resolvers = {
  Query: {
    getUser: async (_, args) => {
      const { id } = args;
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
      return response.data;
    },
    getTodos: async () => {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
      return response.data;
    },
    getUsers: async () => {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      return response.data;
    },
  },
  Todo: {
    user: async (parent) => {
      // This runs for each Todo's `user` field
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${parent.userId}`);
      return response.data;
    },

  },
  User: {
    todos: async (parent) => {
      // fetch todos for this specific user
      const response = await axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${parent.id}`);
      return response.data;
    },
  },
};



    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    app.use(cors());
    app.use(bodyParser.json());

    app.use('/graphql', expressMiddleware(server));

    app.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}/graphql`);
    });
}

startServer();
