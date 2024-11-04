import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { buildSchema } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { resolvers } from './resolvers.js';
import { schema } from './graphql-schema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      try {
        const response = await graphql({
          schema: schema, // Builds the schema from your defined GraphQL schema
          source: query,               // The incoming GraphQL query
          rootValue: resolvers,        // The resolvers to handle the query
          variableValues: variables,    // Any variables for the query
          contextValue: { prisma },     // Pass in the Prisma client to context
          validationRules: [depthLimit(5)] as any, // Apply depth limit to the query
        } as any); // Use type assertion to allow for flexibility

        // Check if there are any errors in the response
        if (response.errors) {
          return { errors: response.errors }; // Return GraphQL errors if present
        }

        return response; // Return the successful GraphQL response
      } catch (error) {
        // Handle unexpected errors gracefully
        return { errors: [{ message: (error as Error).message || 'An unexpected error occurred' }] };
      }
    },
  });
};

export default plugin;
