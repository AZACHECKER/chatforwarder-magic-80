import { useState } from 'react';
import { BotForm } from '@/components/BotForm';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#1A1F2C] py-12 px-4 sm:px-6 lg:px-8">
      <BotForm setIsLoading={setIsLoading} />

      {isLoading && (
        <div className="fixed bottom-4 right-4 w-64 bg-[#221F26] border border-[#9b87f5] rounded">
          <div className="bg-[#9b87f5] h-2 transition-all duration-300" 
               style={{ width: '50%' }}></div>
        </div>
      )}
    </div>
  );
};

export default Index;