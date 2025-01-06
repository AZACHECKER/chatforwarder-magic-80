import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DataTable } from '@/components/DataTable';
import { DraggableWindow } from "./windows/DraggableWindow";
import { DesktopIcon } from "./windows/DesktopIcon";
import { Terminal, Database, Bug } from "lucide-react";

export const BotForm = ({ setIsLoading }: { setIsLoading: (loading: boolean) => void }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isWindowVisible, setIsWindowVisible] = useState(true);
  const [dbStatus, setDbStatus] = useState("Отключено");
  const [isForwarding, setIsForwarding] = useState(false);
  const { toast } = useToast();
  const [botInfo, setBotInfo] = useState({
    apiKey: '',
    botName: '',
    senderChatId: '',
    senderChatName: '',
    receiverChatId: '',
    receiverChatName: '',
    messageId: '',
    textMessage: '',
    lastProcessedId: 0
  });
  const [error, setError] = useState<string | null>(null);

  const fetchBotName = async (apiKey: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`https://api.telegram.org/bot${apiKey}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        setBotInfo(prev => ({ ...prev, botName: data.result.first_name }));
        toast({
          title: "Успех",
          description: "Бот успешно найден",
        });
        // After successful bot verification, start getting updates
        await getUpdates(apiKey);
      } else {
        setError(data.description || "Неавторизованный доступ");
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: data.description || "Неавторизованный доступ",
        });
      }
    } catch (error) {
      setError("Ошибка подключения к API Telegram");
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Ошибка подключения к API Telegram",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUpdates = async (apiKey: string) => {
    try {
      const response = await fetch(`https://api.telegram.org/bot${apiKey}/getUpdates`);
      const data = await response.json();
      
      if (data.ok && data.result.length > 0) {
        const lastMessage = data.result[data.result.length - 1];
        setBotInfo(prev => ({
          ...prev,
          messageId: lastMessage.message.message_id.toString(),
          lastProcessedId: lastMessage.message.message_id
        }));
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  };

  const toggleForwarding = () => {
    setIsForwarding(!isForwarding);
    if (!isForwarding) {
      toast({
        title: "Пересылка запущена",
        description: "Начинаем пересылку сообщений",
      });
    } else {
      toast({
        title: "Пересылка остановлена",
        description: "Пересылка сообщений приостановлена",
      });
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isForwarding && botInfo.apiKey && botInfo.senderChatId && botInfo.receiverChatId) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`https://api.telegram.org/bot${botInfo.apiKey}/getUpdates`);
          const data = await response.json();
          
          if (data.ok && data.result.length > 0) {
            const newMessages = data.result.filter(
              (msg: any) => msg.message.message_id > botInfo.lastProcessedId
            );
            
            for (const msg of newMessages) {
              setBotInfo(prev => ({
                ...prev,
                lastProcessedId: msg.message.message_id,
                messageId: msg.message.message_id.toString(),
                textMessage: msg.message.text || ''
              }));
            }
          }
        } catch (error) {
          console.error("Error in forwarding loop:", error);
        }
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isForwarding, botInfo.apiKey, botInfo.senderChatId, botInfo.receiverChatId, botInfo.lastProcessedId]);

  const handleMinimize = () => {
    setIsMinimized(true);
    setTimeout(() => setIsWindowVisible(false), 300);
  };

  const handleMaximize = () => {
    // Handle maximize state in DraggableWindow component
  };

  const handleClose = () => {
    setIsWindowVisible(false);
  };

  const handleIconClick = () => {
    setIsWindowVisible(true);
    setIsMinimized(false);
  };

  if (!isWindowVisible) {
    return (
      <DesktopIcon
        onClick={handleIconClick}
        title="Bot Forwarder"
        icon="/favicon.ico"
      />
    );
  }

  return (
    <DraggableWindow
      title="Telegram Bot Forwarder"
      isMinimized={isMinimized}
      onMinimize={handleMinimize}
      onMaximize={handleMaximize}
      onClose={handleClose}
      icon={<Terminal className="w-5 h-5 text-[#9b87f5]" />}
      className="bg-[#221F26] text-[#D6BCFA]"
    >
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="font-montserrat flex items-center gap-2">
            <Database className="w-4 h-4 text-[#9b87f5]" />
            Статус БД: {dbStatus}
          </span>
          <div className="space-x-4">
            <button 
              className="win98-button bg-[#221F26] border-[#9b87f5] text-[#D6BCFA] hover:bg-[#2a2533]"
              onClick={() => setDbStatus(prev => prev === "Отключено" ? "Подключено" : "Отключено")}
            >
              {dbStatus === "Отключено" ? "Подключить" : "Отключить"}
            </button>
            <button 
              className={`win98-button ${isForwarding ? 'bg-[#ea384c]' : 'bg-[#9b87f5]'} text-white`}
              onClick={toggleForwarding}
            >
              {isForwarding ? 'Остановить' : 'Начать'} пересылку
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-[#2a2533] border-[#ea384c]">
            <AlertDescription className="text-[#ea384c]">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-montserrat flex items-center gap-2">
                <Bug className="w-4 h-4 text-[#9b87f5]" />
                API Ключ
              </label>
              <Input
                className="win98-input h-12 text-lg bg-[#2a2533] border-[#9b87f5] text-[#D6BCFA] placeholder-[#8E9196]"
                placeholder="Введите API ключ Telegram бота"
                value={botInfo.apiKey}
                onChange={(e) => {
                  setBotInfo(prev => ({ ...prev, apiKey: e.target.value }));
                  if (e.target.value.length > 20) {
                    fetchBotName(e.target.value);
                  }
                }}
              />
              {botInfo.botName && (
                <p className="text-sm font-montserrat text-[#8E9196]">Имя бота: {botInfo.botName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-montserrat">ID Чата отправителя</label>
              <Input
                className="win98-input h-12 text-lg bg-[#2a2533] border-[#9b87f5] text-[#D6BCFA] placeholder-[#8E9196]"
                placeholder="Введите ID чата отправителя"
                value={botInfo.senderChatId}
                onChange={(e) => setBotInfo(prev => ({ ...prev, senderChatId: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="font-montserrat">ID Чата получателя</label>
              <Input
                className="win98-input h-12 text-lg bg-[#2a2533] border-[#9b87f5] text-[#D6BCFA] placeholder-[#8E9196]"
                placeholder="Введите ID чата получателя"
                value={botInfo.receiverChatId}
                onChange={(e) => setBotInfo(prev => ({ ...prev, receiverChatId: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-montserrat">ID Сообщения (необязательно)</label>
              <Input
                className="win98-input h-12 text-lg bg-[#2a2533] border-[#9b87f5] text-[#D6BCFA] placeholder-[#8E9196]"
                placeholder="ID сообщения"
                value={botInfo.messageId}
                onChange={(e) => setBotInfo(prev => ({ ...prev, messageId: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="font-montserrat">Текст сообщения (необязательно)</label>
              <Input
                className="win98-input h-12 text-lg bg-[#2a2533] border-[#9b87f5] text-[#D6BCFA] placeholder-[#8E9196]"
                placeholder="Текст сообщения"
                value={botInfo.textMessage}
                onChange={(e) => setBotInfo(prev => ({ ...prev, textMessage: e.target.value }))}
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="win98-button w-full bg-[#221F26] border-[#9b87f5] text-[#D6BCFA] hover:bg-[#2a2533]">
                  Управление данными
                </Button>
              </DialogTrigger>
              <DialogContent className="win98-window sm:max-w-[900px] bg-[#221F26] border-[#9b87f5]">
                <DialogHeader>
                  <DialogTitle className="text-[#D6BCFA]">Управление данными</DialogTitle>
                </DialogHeader>
                <DataTable />
              </DialogContent>
            </Dialog>

            {isForwarding && (
              <div className="mt-4">
                <div className="w-full bg-[#2a2533] rounded-full h-2.5">
                  <div className="bg-[#9b87f5] h-2.5 rounded-full animate-pulse" style={{ width: '50%' }}></div>
                </div>
                <p className="text-sm text-[#8E9196] mt-2">
                  Последний обработанный ID: {botInfo.lastProcessedId}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DraggableWindow>
  );
};
