'use server';

import { getDb } from "@/utils/getDb";
import { WishlistPageComponent } from "@/app/wishlist/[id]/WishlistPageComponent";
import Link from "next/link";
import { Alert, Divider, Paper, Stack, Typography } from "@mui/material";
import IconInfo from '@mui/icons-material/Info';
import IconQuestionMark from '@mui/icons-material/Help';

export default async function WL({ params }: { params?: { id: string } }) {
  const prisma = getDb();
  const user = await prisma.user.findFirstOrThrow({
    where: { nickname: params?.id },
  });

  return (
    <Paper sx={{ padding: { xs: 1, md: 2 } }}>
      <Stack direction="column" gap={2}>
        <Typography variant="h4">Вишлист юзера <b>{user.nickname}</b></Typography>

        <Divider variant="fullWidth" />

        <Alert icon={<IconInfo fontSize="inherit" />} severity="info">
          Можешь просто нажать на название подарка, и он будет занят. Это анонимно и не требует регистрации.
        </Alert>

        <WishlistPageComponent rawWishlist={user.wishlist.replaceAll('\t', ' ').replaceAll('\r\n', '\n')} nickname={params?.id || ''} />

        <Alert icon={<IconQuestionMark fontSize="inherit" />} severity="info">
          Тоже захотел такой вишлист? <Link href='/register'>Пройди регистрацию и заведи</Link>
        </Alert>
      </Stack>
    </Paper>
  );
}
