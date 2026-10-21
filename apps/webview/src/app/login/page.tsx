import { LoginScreen } from '@/components/screens/LoginScreen';

export default function LoginPage({ searchParams }: { searchParams: { next?: string; mode?: string } }) {
  const next = searchParams.next?.startsWith('/') ? searchParams.next : '/today';
  return <LoginScreen next={next} mode={searchParams.mode === 'signup' ? 'signup' : 'login'} />;
}
