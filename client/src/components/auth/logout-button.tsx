'use client';

import { useRouter } from 'next/navigation';
import * as actions from '@/actions';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const result = await actions.logoutUser();

    if (result.success) {
      router.push('/'); // Redirect to login page
    } else {
      alert(result.message || 'Failed to log out. Please try again.');
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
