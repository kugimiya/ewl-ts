'use server'

import { getDb } from "@/utils/getDb";
import { createHash } from "node:crypto";

export type RegisterState = {
  error: string | null,
  registered: boolean,
};

export async function registerUser(_: RegisterState, data: FormData): Promise<RegisterState> {
  const [nickname, password] = [
    data.get('nickname'), data.get('password')
  ];

  if (!nickname || !password) {
    return { error: 'valid data missed', registered: false };
  } else {
    try {
      const prisma = getDb();
      await prisma.user.create({
        data: {
          nickname: nickname.toString(),
          password: createHash('sha256').update(password.toString()).digest('hex'),
          wishlist: '#Секция начинается с символа тега\nлюбой элемент списка это просто строка\nвот так вот, да\nтеперь сходите на свою публичную страничку',
        },
      });

      return { error: null, registered: true };
    } catch (e) {
      return { error: `${(e as Error).message}`, registered: false };
    }
  }
}
