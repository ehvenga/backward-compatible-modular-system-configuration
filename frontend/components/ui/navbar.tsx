import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className='bg-slate-50 opacity-90 px-24 py-4 flex items-center justify-between gap-x-5 border-b-2'>
      <Link href='/' className='flex items-center gap-x-2'>
        <Image
          src='/logo.png'
          width={30}
          height={30}
          alt='Picture of the author'
        />
        <Image
          src='/logo-letter.png'
          width={200}
          height={50}
          alt='Picture of the author'
        />
      </Link>
      <ul className='flex gap-x-6 text-xl'>
        <li>
          <Link
            href='/tool'
            className='font-medium text-purple-700 cursor-pointer hover:text-purple-800 border-b border-transparent hover:border-b hover:border-purple-700'
          >
            Tool
          </Link>
        </li>
        <li>
          <Link
            href='/paper'
            className='font-medium text-purple-700 cursor-pointer hover:text-purple-800 border-b border-transparent hover:border-b hover:border-purple-700'
          >
            Paper
          </Link>
        </li>
        <li>
          <Link
            href='/team'
            className='font-medium text-purple-700 cursor-pointer hover:text-purple-800 border-b border-transparent hover:border-b hover:border-purple-700'
          >
            Team
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
