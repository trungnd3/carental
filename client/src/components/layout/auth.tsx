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

export default async function Auth() {
  const authToken = (await cookies()).get('Authorization')?.value;

  return (
    <>
      {!authToken && (
        <div className='flex gap-4'>
          <AuthDialog type='login' />
          <AuthDialog type='register' />
        </div>
      )}
      {authToken && (
        <Menubar className='border-none'>
          <MenubarMenu>
            <MenubarTrigger>
              <Avatar className='cursor-pointer'>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Settings</MenubarItem>

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
