'use client';

import { useFormState } from 'react-dom'
import { RegisterState, registerUser } from "@/app/actions/registerUser";
import Link from "next/link";

const initialState: RegisterState = {
  error: null,
  registered: false,
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerUser, initialState);

  return (
    <main>
      <h2>Регистрация</h2>

      {!state.registered && !state.error && (
        <div>
          <form action={formAction}>
            <input type="text" name="nickname" placeholder="Никнейм" required />
            <input type="password" name="password" placeholder="Пароль" required />
            <input type="submit" value="Далее" />
          </form>
        </div>
      )}

      {!state.registered && state.error && (
        <div>Ошибка: {state.error}</div>
      )}

      {state.registered && (
        <div>Регистрация прошла успешно, <Link href='/login'>авторизуйтесь</Link></div>
      )}
    </main>
  );
}
