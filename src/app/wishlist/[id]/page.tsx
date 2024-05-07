'use server';

import { getDb } from "@/utils/getDb";
import { WishlistPageComponent } from "@/app/wishlist/[id]/WishlistPageComponent";
import Link from "next/link";

export default async function WL({ params }: { params?: { id: string } }) {
  const prisma = getDb();
  const user = await prisma.user.findFirstOrThrow({
    where: { nickname: params?.id },
  });

  return (
    <div>
      <h1>список_желание пользователя {user.nickname}</h1>
      <br />
      <p>Можете просто нажать на название подарка, и он будет занят вами. Это анонимно и не требует регистрации. Больше не будет ситуации, когда человеку подарят два одинаковых подарка. :)</p>
      <br />
      <p>Тоже захотел такой вишлист? <Link href='/register'>Пройди регистрацию и заведи</Link></p>
      <br />
      <WishlistPageComponent rawWishlist={user.wishlist} nickname={params?.id || ''} />
    </div>
  );
}
