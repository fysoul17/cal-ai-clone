import AuthFormWrapper from '@/app/components/auth/AuthFormWrapper';
import SignInForm from '@/app/components/auth/SignInForm';

export const metadata = {
  title: 'Sign In | Cal AI',
  description: 'Sign in to your Cal AI account to track your nutrition.',
};

export default function SignInPage() {
  return (
    <AuthFormWrapper
      title="Welcome Back"
      subtitle="Sign in to continue tracking"
    >
      <SignInForm />
    </AuthFormWrapper>
  );
}
