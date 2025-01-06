import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from '@/components/DataTable';
import { BotForm } from '@/components/BotForm';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-[#008080] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="win98-icon">
          <img src="/favicon.ico" alt="App Icon" className="w-8 h-8" />
          <span className="text-white text-sm mt-1">Bot Forwarder</span>
        </div>

        <BotForm setIsLoading={setIsLoading} />

        <div className="flex justify-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="win98-button">
                Управление данными
              </Button>
            </DialogTrigger>
            <DialogContent className="win98-window sm:max-w-[900px]">
              <DialogHeader>
                <DialogTitle>Управление данными</DialogTitle>
              </DialogHeader>
              <DataTable />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="default" 
            className="win98-button"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                toast({
                  title: "Сообщение переслано",
                  description: "Ваше сообщение успешно переслано.",
                });
              }, 1500);
            }}
          >
            Переслать сообщение
          </Button>
        </div>

        {isLoading && (
          <div className="w-full bg-gray-200 rounded-none border border-gray-400">
            <div className="bg-[#000080] h-2 transition-all duration-300" 
                 style={{ width: '50%' }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;