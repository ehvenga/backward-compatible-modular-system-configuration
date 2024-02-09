const MainButton = ({ buttonName }: { buttonName: string }) => {
  return (
    <button className='bg-black text-yellow-50 hover:text-yellow-100 border border-black p-2 w-64 rounded-md hover:ring-2 hover:ring-gray-500 hover:ring-offset-4 hover:ring-offset-gray-200'>
      {buttonName}
    </button>
  );
};

export default MainButton;
