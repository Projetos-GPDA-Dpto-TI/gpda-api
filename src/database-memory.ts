import { UUID, randomUUID } from 'crypto';

type usersList = Map<UUID, user> | any;

interface user {
  name: string;
  email: string;
  role: string;
}

interface userfinal extends user {
  id: UUID;
}

export class DatabaseMemory {
  private users: usersList = new Map(); //aqui o uso do set evita usuarios duplicados

  list(): Array<userfinal> {
    return Array.from(this.users.entries()).map((userArray: any) => {
      const id = userArray[0];
      const data = userArray[1];

      return {
        id,
        ...data,
      };
    });
  }

  async create(user: user): Promise<any> {
    const userId = randomUUID();
    this.users.set(userId, user);
    return { id: userId, user: user };
  }

  async update(id: UUID, user: user): Promise<void> {
    this.users.set(id, user);
  }

  async delete(id: UUID): Promise<void> {
    this.users.delete(id);
  }
}
