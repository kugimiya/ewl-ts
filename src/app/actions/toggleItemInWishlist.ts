'use server';

import { getDb } from "@/utils/getDb";

export const toggleItemInWishlist = async (nickname: string, itemIndex: number) => {
  const prisma = getDb();
  const user = await prisma.user.findFirstOrThrow({
    where: {
      nickname: nickname,
    }
  });

  const strings = user.wishlist.split('\n');
  strings[itemIndex] = `(занято) ${strings[itemIndex]}`;

  await prisma.user.update({
    where: {
      nickname: nickname,
    },
    data: {
      wishlist: strings.join('\n'),
    }
  });
}
