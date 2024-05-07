import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Это сервис список_желание</h1>

      <Link href='/login'>Логиниться здесь</Link>
      <br />
      <Link href='/register'>Регаться здесь</Link>
    </main>
  );
}
