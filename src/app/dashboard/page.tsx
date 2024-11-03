'use server';

import { cookies } from "next/headers";
import { getDb } from "@/utils/getDb";
import FormComponent from "@/app/dashboard/FormComponent";
import Link from "next/link";
import { Alert, Paper, Stack, Typography } from "@mui/material";
import IconInfo from '@mui/icons-material/Info';
import Divider from '@mui/material/Divider';

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
    <Paper sx={{ padding: 2 }}>
      <Stack direction="column" gap={2}>
        <Typography variant="h4">Редактор вишлиста</Typography>

        <Divider variant="fullWidth" />

        <Alert icon={<IconInfo fontSize="inherit" />} severity="info">
          Ссылка на <Link href={`/wishlist/${data.User.nickname}`}>публичную страницу</Link> этого вишлиста
        </Alert>

        <FormComponent originWishlist={data.User.wishlist} />
      </Stack>
    </Paper>
  );
}
