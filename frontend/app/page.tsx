import MainButton from '@/components/mainButton';

export function Home() {
  return (
    <main className='flex w-full'>
      <div className='flex flex-col w-full justify-center'>
        <p className='w-full flex justify-center text-lg pb-3'>
          Choose Strategy
        </p>
        <div className='w-full flex justify-center gap-x-10'>
          <MainButton buttonName='Dynamic Programming' value='dp' />
          <MainButton buttonName='Brute Force' value='bf' />
          <MainButton buttonName='Compare' value='cp' />
        </div>
      </div>
    </main>
  );
}

export default Home;
