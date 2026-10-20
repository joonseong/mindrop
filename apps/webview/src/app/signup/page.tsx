import { AuthForm } from '@/components/AuthForm';
import { TopBar } from '@/components/TopBar';

export default function SignupPage({ searchParams }: { searchParams: { next?: string; reason?: string } }) {
  return (
    <>
      <TopBar back />
      <AuthForm mode="signup" next={searchParams.next} reason={searchParams.reason} />
    </>
  );
}
