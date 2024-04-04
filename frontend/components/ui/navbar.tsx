import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className='bg-slate-50 px-24 py-4 flex items-center justify-between gap-x-5 border-b-2'>
      <div className='flex items-center'>
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
      </div>
      <h1 className='text-2xl font-semibold'>Interactive Configuration Tool</h1>
    </nav>
  );
};

export default Navbar;
