'use server';

import { getDb } from "@/utils/getDb";
import { WishlistPageComponent } from "@/app/wishlist/[id]/WishlistPageComponent";

export default async function WL({ params }: { params?: { id: string } }) {
  const prisma = getDb();
  const user = await prisma.user.findFirstOrThrow({
    where: { nickname: params?.id },
  });

  return (
    <div>
      <h1>список_желание пользователя {user.nickname}</h1>
      <br />
      <WishlistPageComponent rawWishlist={user.wishlist} nickname={params?.id || ''} />
    </div>
  );
}
