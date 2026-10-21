import { SignupScreen } from '@/components/screens/SignupScreen';

export default function SignupPage({ searchParams }: { searchParams: { next?: string } }) {
  const next = searchParams.next?.startsWith('/') ? searchParams.next : '/today';
  return <SignupScreen next={next} />;
}
