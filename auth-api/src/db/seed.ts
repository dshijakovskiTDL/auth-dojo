import { users } from './schema';
import { db } from '.';
import { hashPassword } from '../routers/shared/utils';

type User = typeof users.$inferInsert;

const mockUsers: User[] = [
  {
    publicId: Bun.randomUUIDv7(),
    authType: 'credentials',
    email: 'tester1@auth-dojo.com',
    password: await hashPassword('tester1'),
    firstName: 'Tester',
    lastName: 'One',
  },
  {
    publicId: Bun.randomUUIDv7(),
    authType: 'credentials',
    email: 'tester2@auth-dojo.com',
    password: await hashPassword('tester2'),
    firstName: 'Tester',
    lastName: 'Two',
  },
  {
    publicId: Bun.randomUUIDv7(),
    authType: 'credentials',
    email: 'tester3@auth-dojo.com',
    password: await hashPassword('tester3'),
    firstName: 'Tester',
    lastName: 'Three',
  },
];

await db.delete(users);
await db.insert(users).values(mockUsers);

console.log('Database seeded ✅', mockUsers.length, 'users');
process.exit(0);
