import { Divider, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { Link as MuiLink } from "@mui/material";

export default function Home() {
  return (
    <Paper sx={{ padding: 2 }}>
      <Stack direction="column" gap={2}>
        <Typography variant="h4">Это микросервис для вишлистов</Typography>

        <Divider variant="fullWidth" />

        <Stack direction="row" gap={2}>
          <MuiLink href='/login' component={Link}>Логин</MuiLink>
          <MuiLink href='/register' component={Link}>Регистрация</MuiLink>
        </Stack>
      </Stack>
    </Paper>
  );
}
