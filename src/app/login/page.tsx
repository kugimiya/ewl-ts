'use client';

import { useFormState } from 'react-dom'
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { LoginState, loginUser } from "@/app/actions/loginUser";
import { Divider, Paper, Stack, Typography } from '@mui/material';

const initialState: LoginState = {
  error: null,
  logined: false,
  session: null,
}

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(loginUser, initialState);

  useEffect(() => {
    if (state.logined && state.session) {
      localStorage.setItem("session", state.session);
      router.push('/dashboard');
    }
  }, [state.logined, state.session]);

  return (
    <Paper sx={{ padding: 2 }}>
      <Stack direction="column" gap={2}>
        <Typography variant="h4">Логин</Typography>

        <Divider variant="fullWidth" />

        {!state.logined && !state.error && (
          <form action={formAction}>
            <Stack direction="column" gap={1} maxWidth={480}>
              <input type="text" name="nickname" placeholder="Никнейм" required />
              <input type="password" name="password" placeholder="Пароль" required />
              <input type="submit" value="Далее" />
            </Stack>
          </form>
        )}

        {!state.logined && state.error && (
          <div>Ошибка: {state.error}</div>
        )}

        {state.logined && (
          <div>Логин прошел успешно, дождитесь перенаправления на дашборд</div>
        )}
      </Stack>
    </Paper>
  );
}
