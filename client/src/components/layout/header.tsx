import Link from 'next/link';
import Auth from './auth';
import { cookies } from 'next/headers';

const ROUTES = [
  {
    text: 'Showroom',
    href: '/showroom',
    public: true,
  },
  {
    text: 'History',
    href: '/history',
    public: false,
  },
];

export default async function Header() {
  const authToken = (await cookies()).get('Authorization')?.value;

  return (
    <header className='shadow-zinc-300 shadow'>
      <div className='flex flex-wrap items-center justify-between gap-6 sm:h-16 px-8'>
        <div className='flex items-center gap-12 h-full'>
          <Link href='/'>
            <span className='text-2xl font-extrabold bg-gradient-to-bl from-zinc-500 to-zinc-800 bg-clip-text text-transparent hover:cursor-pointer'>
              CARENTAL
            </span>
          </Link>
          <nav className='flex gap-6 h-full'>
            {ROUTES.map((route) => (
              <div key={route.href}>
                {(route.public || (!route.public && authToken)) && (
                  <Link
                    href={route.href}
                    className='h-full flex flex-col justify-center items-center min-w-20'
                  >
                    <p>{route.text}</p>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
        <Auth />
      </div>
    </header>
  );
}
