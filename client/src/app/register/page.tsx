import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <>
      <div className='w-full flex justify-center'>
        <h1 className='font-bold text-2xl p-4'>Create an Account</h1>
      </div>

      <div className='w-full flex justify-center'>
        <div className='w-2/5 p-8 rounded-2xl shadow-2xl bg-slate-50'>
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
