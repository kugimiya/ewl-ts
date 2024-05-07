'use client';

import { useFormState } from 'react-dom'
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { LoginState, loginUser } from "@/app/actions/loginUser";

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
    <main>
      <h2>Логин</h2>

      {!state.logined && !state.error && (
        <div>
          <form action={formAction}>
            <input type="text" name="nickname" placeholder="Никнейм" required />
            <input type="password" name="password" placeholder="Пароль" required />
            <input type="submit" value="Далее" />
          </form>
        </div>
      )}

      {!state.logined && state.error && (
        <div>Ошибка: {state.error}</div>
      )}

      {state.logined && (
        <div>Логин прошел успешно, дождитесь перенаправления на дашборд</div>
      )}
    </main>
  );
}
