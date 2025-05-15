'use client';

import { useRouter } from 'next/navigation';
import * as actions from '@/actions';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const result = await actions.logoutUser();

    if (result.success) {
      router.push('/'); // Redirect to login page
    } else {
      toast('Logout failed', {
        description: result.message || 'Failed to log out. Please try again.',
      });
    }
  };

  return (
    <Button
      variant='ghost'
      className='cursor-pointer w-full'
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
