import InterfaceConfig from './interfaceConfig';

const DesignConfig = () => {
  return (
    <div className='w-full flex  flex-wrap gap-x-6 mt-12 mx-8 px-10 py-8 border border-black rounded-lg'>
      <input type='file' name='Choose File' />
      <div className='flex gap-x-2'>
        <label htmlFor='inputParam' id='inputParam'>
          Initial Interface
        </label>
        <input type='number' name='inputParam' />
      </div>
      <div className='flex gap-x-2'>
        <label htmlFor='outputParam'>Goal Interface</label>
        <input type='number' name='outputParam' id='outputParam' />
      </div>
      <div className='flex gap-x-2'>
        <label htmlFor='outputParam'>Choose Steps</label>
        <input type='number' name='outputParam' id='outputParam' />
      </div>
      <InterfaceConfig />
    </div>
  );
};

export default DesignConfig;
