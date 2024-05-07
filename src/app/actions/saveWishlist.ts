'use server'

import { getDb } from "@/utils/getDb";
import { cookies } from "next/headers";

export type SaveWishlistState = {
  error: string | null,
  saved: boolean,
};

export async function saveWishlist(_: SaveWishlistState, data: FormData): Promise<SaveWishlistState> {
  const session = cookies().get('session');
  const prisma = getDb();
  const sessionData = await prisma.sessions.findFirstOrThrow({
    where: {
      hash: session?.value
    },
    include: {
      User: true
    }
  });

  const [wishlist] = [
    data.get('wishlist')
  ];

  if (!wishlist || !sessionData.User) {
    return { error: 'valid data missed', saved: false };
  } else {
    try {
      const prisma = getDb();
      await prisma.user.update({
        data: {
          wishlist: wishlist.toString()
        },
        where: {
          nickname: sessionData.User.nickname,
        }
      });

      return { error: null, saved: true };
    } catch (e) {
      return { error: `${(e as Error).message}`, saved: false };
    }
  }
}
