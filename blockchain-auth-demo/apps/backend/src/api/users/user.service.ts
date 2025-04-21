import { User } from '@demo/sdk';
import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import path from 'path';

// For demo purposes, using a local file to store users
const DATA_FILE = path.resolve(__dirname, '../../../data/users.json');

const readStorage = async (): Promise<User[]> => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    // New file
    return [];
  }
};

const writeStorage = async (users: User[]) => {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
};

@Injectable()
export class UserService {
  constructor() {}

  async create(user: User): Promise<User> {
    const users = await readStorage();
    users.push(user);
    await writeStorage(users);
    return user;
  }

  async findAll(): Promise<User[]> {
    return await readStorage();
  }

  async findById(id: string): Promise<User | null> {
    const users = await readStorage();
    return users.find((u) => u.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await readStorage();
    return users.find((u) => u.email === email) ?? null;
  }
}
