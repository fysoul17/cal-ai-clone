import AuthFormWrapper from '@/app/components/auth/AuthFormWrapper';
import ForgotPasswordForm from '@/app/components/auth/ForgotPasswordForm';

export const metadata = {
  title: 'Forgot Password | Cal AI',
  description: 'Reset your Cal AI account password.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthFormWrapper
      title="Forgot Password"
      subtitle="No worries, we&apos;ll help you reset it"
    >
      <ForgotPasswordForm />
    </AuthFormWrapper>
  );
}
