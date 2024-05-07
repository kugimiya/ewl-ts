'use server';

import { cookies } from "next/headers";
import { getDb } from "@/utils/getDb";
import FormComponent from "@/app/dashboard/FormComponent";
import Link from "next/link";

export default async function DashboardPage() {
  const session = cookies().get('session');
  const prisma = getDb();
  const data = await prisma.sessions.findFirstOrThrow({
    where: {
      hash: session?.value
    },
    include: {
      User: true
    }
  });

  if (!data.User) {
    return <>You need login!</>;
  }

  return (
    <div>
      <Link href={`/wishlist/${data.User.nickname}`}>Публичная страница этого вишлиста</Link>
      <br /><br />
      <FormComponent wishlist={data.User.wishlist} />
    </div>
  );
}
