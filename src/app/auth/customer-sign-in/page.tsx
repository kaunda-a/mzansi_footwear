import { Metadata } from 'next';
import { CustomerAuthForm } from '@/features/auth/components/customer-auth-form';

export const metadata: Metadata = {
  title: 'Sign In | Mzansi Footwear',
  description: 'Sign in to your Mzansi Footwear account or create a new account.'
};

export default function CustomerSignInPage() {
  return <CustomerAuthForm />;
}
