import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const NUMBER_OF_USERS = 30;

const data = Array.from({ length: NUMBER_OF_USERS }).map(() => ({
  email: faker.internet.email(),
  name: faker.name.firstName(),
  password: faker.internet.password(),
  uuid: faker.datatype.uuid(),
}));

async function main() {
  for (const entry of data) {
    try {
      await prisma.user.create({
        data: {
          name: entry.name,
          email: entry.email,
          password: entry.password,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
