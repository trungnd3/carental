import Image from 'next/image';

export default function Footer() {
  return (
    <footer className='flex flex-wrap items-center justify-end gap-6 w-full h-16'>
      <a
        className='flex items-center gap-2 hover:underline hover:underline-offset-4'
        href='https://github.com/trungnd3/carental'
        target='_blank'
        rel='noopener noreferrer'
      >
        <Image
          aria-hidden
          src='/github.svg'
          alt='Github icon'
          width={32}
          height={32}
        />
      </a>
    </footer>
  );
}
