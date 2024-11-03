'use client';

import { useFormState } from 'react-dom'
import { RegisterState, registerUser } from "@/app/actions/registerUser";
import Link from "next/link";
import { Divider, Paper, Stack, Typography } from '@mui/material';

const initialState: RegisterState = {
  error: null,
  registered: false,
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerUser, initialState);

  return (
    <Paper sx={{ padding: 2 }}>
      <Stack direction="column" gap={2}>
        <Typography variant="h4">Регистрация</Typography>

        <Divider variant="fullWidth" />

        {!state.registered && !state.error && (
          <form action={formAction}>
            <Stack direction="column" gap={1} maxWidth={480}>
              <input type="text" name="nickname" placeholder="Никнейм" required />
              <input type="password" name="password" placeholder="Пароль" required />
              <input type="submit" value="Далее" />
            </Stack>
          </form>
        )}

        {!state.registered && state.error && (
          <div>Ошибка: {state.error}</div>
        )}

        {state.registered && (
          <div>Регистрация прошла успешно, <Link href='/login'>авторизуйтесь</Link></div>
        )}
      </Stack>
    </Paper>
  );
}
