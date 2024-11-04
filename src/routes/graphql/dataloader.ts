import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();  

// Batch loading function for users
const userLoader = new DataLoader(async (keys: readonly string[]) => {
  const users = await prisma.user.findMany({
    where: {
      id: { in: keys as string[] },
    },
  });
  return keys.map(key => users.find(user => user.id === key));
});

export default userLoader;
