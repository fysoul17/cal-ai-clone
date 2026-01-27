import AuthFormWrapper from '@/app/components/auth/AuthFormWrapper';
import ResetPasswordForm from '@/app/components/auth/ResetPasswordForm';

export const metadata = {
  title: 'Reset Password | Cal AI',
  description: 'Set a new password for your Cal AI account.',
};

export default function ResetPasswordPage() {
  return (
    <AuthFormWrapper
      title="Reset Password"
      subtitle="Create your new password"
    >
      <ResetPasswordForm />
    </AuthFormWrapper>
  );
}
