import { DataSource } from 'typeorm';

export async function seedData(dataSource: DataSource) {
  const userRepo = dataSource.getRepository('User');

  await dataSource.dropDatabase();
  await dataSource.synchronize();

  const usersCount = await userRepo.count();

  if (!usersCount) {
    const users = await userRepo.insert([
      {
        login: 'bob',
        email: 'bob@gmail.com',
        hash: 'bob-hash',
      },
      {
        login: 'alice',
        email: 'alice@gmail.com',
        hash: 'alice-hash',
      },
      {
        login: 'eve',
        email: 'eve@gmail.com',
        hash: 'eve-hash',
      },
      {
        login: 'hanna',
        email: 'hanna@gmail.com',
        hash: 'hanna-hash',
      },
      {
        login: 'hAnna2',
        email: 'hAnna2@gmail.com',
        hash: 'hanna-hash',
      },
      {
        login: 'john',
        email: 'john@gmail.com',
        hash: 'john-hash',
      },
    ]);
  }
}
