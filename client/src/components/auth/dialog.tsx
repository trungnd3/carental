import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from '@/components/ui';
import { LoginForm } from './login-form';

type AuthDialogProps = {
  type: 'login' | 'register';
};

export default function AuthDialog({ type }: AuthDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={type === 'login' ? 'default' : 'secondary'}
          className='hover:cursor-pointer'
        >
          {type === 'login' ? 'Log In' : 'Register'}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{type === 'login' ? 'Log In' : 'Register'}</DialogTitle>
          <DialogDescription>
            {`Start renting a car with your account`}
          </DialogDescription>
        </DialogHeader>
        {type === 'login' && <LoginForm />}
        {type === 'register' && (
          <div>Feature has not been implemented in FrontEnd yet.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
