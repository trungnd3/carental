import { cookies } from 'next/headers';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LogoutButton from '@/components/auth/logout-button';
import AuthDialog from '@/components/auth/dialog';
import { getCurrentUser } from '@/queries';
import { Button } from '../ui/button';
import Link from 'next/link';

export default async function Auth() {
  let authToken = (await cookies()).get('Authorization')?.value;
  const currentUser = await getCurrentUser();

  if (currentUser.error?.code === 401) {
    authToken = undefined;
  }

  return (
    <>
      {!authToken && (
        <div className='flex gap-4'>
          <AuthDialog type='login' />
          <Button className='/register' asChild variant='secondary'>
            <Link href='/register'>Register</Link>
          </Button>
        </div>
      )}
      {authToken && (
        <Menubar className='border-none'>
          <MenubarMenu>
            <MenubarTrigger>
              <Avatar className='cursor-pointer'>
                <AvatarImage
                  src={
                    currentUser?.data?.avatar
                      ? currentUser?.data?.avatar
                      : 'https://github.com/shadcn.png'
                  }
                />
                <AvatarFallback>TN</AvatarFallback>
              </Avatar>
            </MenubarTrigger>
            <MenubarContent>
              <div className='p-2'>
                <span>{currentUser?.data?.email}</span>
              </div>

              <MenubarSeparator />

              <MenubarItem>
                <LogoutButton />
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )}
    </>
  );
}
