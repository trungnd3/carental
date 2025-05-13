import { API_BASE_URL } from '@/api';
import Image from 'next/image';
import Link from 'next/link';

console.log(API_BASE_URL)
export default function Home() {
  return (
    <>

      <div className='flex gap-4 justify-center items-center flex-col sm:flex-row w-full'>
        <Link
          className='rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto'
          href='/showroom'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            className='dark:invert'
            src='/vercel.svg'
            alt='Vercel logomark'
            width={20}
            height={20}
          />
          Get started
        </Link>
      </div>
    </>
  );
}
