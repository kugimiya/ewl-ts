'use server'

import { getDb } from "@/utils/getDb";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";

export type LoginState = {
  error: string | null,
  logined: boolean,
  session: string | null,
};

export async function loginUser(_: LoginState, data: FormData): Promise<LoginState> {
  const [nickname, password] = [
    data.get('nickname'), data.get('password')
  ];

  if (!nickname || !password) {
    return { error: 'valid data missed', logined: false, session: null };
  } else {
    try {
      const prisma = getDb();
      const user = await prisma.user.findFirstOrThrow({
        where: {
          nickname: nickname.toString(),
          password: createHash('sha256').update(password.toString()).digest('hex')
        }
      });

      const session = await prisma.sessions.create({
        data: {
          userId: user.id,
          hash: Date.now().toString(), // fixme: nanoid
        }
      });

      cookies().set('session', session.hash);
      return { error: null, logined: true, session: session.hash };
    } catch (e) {
      return { error: `${(e as Error).message}`, logined: false, session: null };
    }
  }
}
