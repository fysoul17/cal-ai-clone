import AuthFormWrapper from '@/app/components/auth/AuthFormWrapper';
import SignUpForm from '@/app/components/auth/SignUpForm';

export const metadata = {
  title: 'Sign Up | Cal AI',
  description: 'Create your Cal AI account to start tracking your nutrition.',
};

export default function SignUpPage() {
  return (
    <AuthFormWrapper
      title="Create Account"
      subtitle="Start your nutrition journey today"
    >
      <SignUpForm />
    </AuthFormWrapper>
  );
}
