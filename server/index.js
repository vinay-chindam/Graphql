import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

const port = 3000;

async function startServer() {
    const app = express();

    const typeDefs = `
  type Todo{
    id: ID!
    title: String!
    completed: Boolean!
  }

  type User{
  id: ID!
  name: String!
  username: String!
  email: String!
  
  }
    
    
    type Query {
    getTodos: [Todo!]!
    getUsers:[User!]!
    }
  `


        ;

    const resolvers = {
        Query: {
            getTodos: async () => {
                const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
                return response.data; 
            },
            getUsers: async()=> {
                const response = axios.get('https://jsonplaceholder.typicode.com/users')
                return (await response).data;
            }

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
