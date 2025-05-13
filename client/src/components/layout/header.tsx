import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ROUTES = [
  {
    text: 'Showroom',
    href: '/showroom',
  },
  {
    text: 'History',
    href: '/history',
  },
];

export default function Header() {
  return (
    <header className='shadow-zinc-300 shadow'>
      <div className='flex flex-wrap items-center justify-between gap-6 md:h-16 px-8'>
        <div className='flex items-center gap-12 h-full'>
          <Link href='/'>
            <span className='text-2xl font-extrabold bg-gradient-to-bl from-zinc-500 to-zinc-800 bg-clip-text text-transparent hover:cursor-pointer'>
              CARENTAL
            </span>
          </Link>
          <nav className='flex gap-6 h-full'>
            {ROUTES.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className='h-full flex flex-col justify-center items-center min-w-20'
              >
                <p>{route.text}</p>
              </Link>
            ))}
          </nav>
        </div>
        <Button variant='outline' className='hover:cursor-pointer'>
          Log in
        </Button>
      </div>
    </header>
  );
}
