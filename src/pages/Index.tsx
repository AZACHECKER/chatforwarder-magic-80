import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from '@/components/DataTable';
import { BotForm } from '@/components/BotForm';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Message Forwarder
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Seamlessly forward messages between Telegram chats
          </p>
        </div>

        <div className="glass-panel rounded-xl p-6 sm:p-8">
          <BotForm setIsLoading={setIsLoading} />
        </div>

        <div className="flex justify-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="btn-secondary">
                Manage Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px]">
              <DialogHeader>
                <DialogTitle>Data Management</DialogTitle>
              </DialogHeader>
              <DataTable />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="default" 
            className="btn-primary"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                toast({
                  title: "Message Forwarded",
                  description: "Your message has been successfully forwarded.",
                });
              }, 1500);
            }}
          >
            Forward Message
          </Button>
        </div>

        {isLoading && (
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div className="bg-gray-900 h-1 rounded-full transition-all duration-300" 
                 style={{ width: '50%' }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;