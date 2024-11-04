import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolvers = {
  RootQueryType: {
    users: async () => {
      return await prisma.user.findMany({
        include: {
          profile: {
            include: {
              memberType: true,
            },
          },
          posts: true,
          userSubscribedTo: {
            include: {
              author: true,
            },
          },
          subscribedToUser: {
            include: {
              subscriber: true,
            },
          },
        },
      });
    },

    user: async (_: any, { id }: { id: string }) => {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          profile: {
            include: {
              memberType: true,
            },
          },
          posts: true,
          userSubscribedTo: {
            include: {
              author: true,
            },
          },
          subscribedToUser: {
            include: {
              subscriber: true,
            },
          },
        },
      });
    },

    posts: async () => {
      return await prisma.post.findMany();
    },

    post: async (_: any, { id }: { id: string }) => {
      return await prisma.post.findUnique({
        where: { id },
      });
    },

    profiles: async () => {
      return await prisma.profile.findMany({
        include: {
          memberType: true,
        },
      });
    },

    profile: async (_: any, { id }: { id: string }) => {
      return await prisma.profile.findUnique({
        where: { id },
        include: {
          memberType: true,
        },
      });
    },

    memberTypes: async () => {
      return await prisma.memberType.findMany();
    },

    memberType: async (_: any, { id }: { id: string }) => {
      return await prisma.memberType.findUnique({
        where: { id },
      });
    },
  },

  Mutations: {
    createUser: async (_: any, { dto }: any) => {
      return await prisma.user.create({
        data: dto,
      });
    },

    changeUser: async (_: any, { id, dto }: any) => {
      return await prisma.user.update({
        where: { id },
        data: dto,
      });
    },

    deleteUser: async (_: any, { id }: any) => {
      await prisma.user.delete({
        where: { id },
      });
      return "User deleted";
    },

    createPost: async (_: any, { dto }: any) => {
      return await prisma.post.create({
        data: dto,
      });
    },

    changePost: async (_: any, { id, dto }: any) => {
      return await prisma.post.update({
        where: { id },
        data: dto,
      });
    },

    deletePost: async (_: any, { id }: any) => {
      await prisma.post.delete({
        where: { id },
      });
      return "Post deleted";
    },

    createProfile: async (_: any, { dto }: any) => {
      return await prisma.profile.create({
        data: dto,
      });
    },

    changeProfile: async (_: any, { id, dto }: any) => {
      return await prisma.profile.update({
        where: { id },
        data: dto,
      });
    },

    deleteProfile: async (_: any, { id }: any) => {
      await prisma.profile.delete({
        where: { id },
      });
      return "Profile deleted";
    },

    subscribeTo: async (_: any, { userId, authorId }: any) => {
      await prisma.subscribersOnAuthors.create({
        data: { subscriberId: userId, authorId },
      });
      return "Subscribed";
    },

    unsubscribeFrom: async (_: any, { userId, authorId }: any) => {
      await prisma.subscribersOnAuthors.delete({
        where: { subscriberId_authorId: { subscriberId: userId, authorId } },
      });
      return "Unsubscribed";
    },
  },
};
