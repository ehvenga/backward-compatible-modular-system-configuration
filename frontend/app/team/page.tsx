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
      <Card className='relative bg-white shadow-lg sm:rounded-3xl p-6 bg-clip-padding bg-opacity-80 border border-gray-100'>
        Consectetur consequat ullamco pariatur cupidatat excepteur ut veniam
        aute ullamco eiusmod magna Lorem culpa. Sunt enim mollit ut Lorem sint
        cillum sunt cillum ex quis quis. Enim sit dolore fugiat amet
        exercitation aute eu est anim incididunt aute.
      </Card>
    </main>
  );
};

export default TeamPage;
