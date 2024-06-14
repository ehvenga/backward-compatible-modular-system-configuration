import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const TeamPage = () => {
  return (
    <main className='mt-2 z-10'>
      <h1 className='text-3xl font-semibold text-white pb-4 z-10'>
        Meet the Team
      </h1>
      <div className='flex flex-col gap-y-3'>
        <Card className='relative bg-white shadow-lg sm:rounded-3xl p-10 bg-clip-padding bg-opacity-80 border border-gray-100 gap-y-3 flex flex-col'>
          <CardTitle>Hari (Vengadesh) Elangeswaran</CardTitle>
          <CardContent>
            <p className='font-semibold'>Graduate Student</p>
            <div>
              The Department of Industrial and Manufacturing Engineering and
              Technology, Bradley University, Peoria, IL
            </div>
            <ul className='mt-2 pl-8 font-light list-disc'>
              <li>B.Tech., Manipal Technology of Institute, India</li>
              <li>
                M.S., Bradley University{' '}
                <span className='italic'>(ongoing)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className='relative bg-white shadow-lg sm:rounded-3xl p-10 bg-clip-padding bg-opacity-80 border border-gray-100 gap-y-3 flex flex-col'>
          <CardTitle>John (Jung-Woon) Yoo</CardTitle>
          <CardContent>
            <p className='font-semibold'>Associate Professor</p>
            <div>
              The Department of Industrial and Manufacturing Engineering and
              Technology, Bradley University, Peoria, IL
            </div>
            <ul className='mt-2 pl-8 font-light list-disc'>
              <li>Ph.D., The Pennsylvania State University</li>
              <li>M.S., Seoul National University</li>
              <li>B.S., Korea University</li>
            </ul>
          </CardContent>
        </Card>
        <Card className='relative bg-white shadow-lg sm:rounded-3xl p-10 bg-clip-padding bg-opacity-80 border border-gray-100 gap-y-3 flex flex-col'>
          <CardTitle>Gangjian Guo</CardTitle>
          <CardContent>
            <p className='font-semibold'>Associate Professor</p>
            <div>
              The Department of Industrial and Manufacturing Engineering and
              Technology, Bradley University, Peoria, IL
            </div>
            <ul className='mt-2 pl-8 font-light list-disc'>
              <li>Ph.D., University of Toronto</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default TeamPage;
