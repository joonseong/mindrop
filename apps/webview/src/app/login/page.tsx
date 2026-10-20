import { AuthForm } from '@/components/AuthForm';
import { TopBar } from '@/components/TopBar';

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <>
      <TopBar back />
      <AuthForm mode="login" next={searchParams.next} />
    </>
  );
}
