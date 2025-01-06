import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal, Database } from "lucide-react";
import { DraggableWindow } from "./windows/DraggableWindow";
import { MessageTable } from "./MessageTable";
import { saveBotData, getBotMessages, forwardMessage, BotMessage } from "@/utils/botDataService";

export const BotForm = ({ setIsLoading }: { setIsLoading: (loading: boolean) => void }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isWindowVisible, setIsWindowVisible] = useState(true);
  const [dbStatus, setDbStatus] = useState("Отключено");
  const [isForwarding, setIsForwarding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const { toast } = useToast();
  
  const [botInfo, setBotInfo] = useState({
    apiKey: '',
    botName: '',
    senderChatId: '',
    receiverChatId: '',
    messageId: '',
    textMessage: '',
    lastProcessedId: 0
  });
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMessages(getBotMessages());
  }, []);

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
        const messages = data.result;
        let processedCount = 0;
        
        for (const msg of messages) {
          const savedMessage = saveBotData({
            apiKey,
            senderChatId: msg.message.chat.id.toString(),
            receiverChatId: botInfo.receiverChatId,
            messageId: msg.message.message_id.toString(),
            textMessage: msg.message.text || ''
          });
          
          processedCount++;
          setProgress((processedCount / messages.length) * 100);
          
          if (botInfo.receiverChatId) {
            await forwardMessage(apiKey, msg.message.text || '', botInfo.receiverChatId);
          }
        }
        
        setMessages(getBotMessages());
        setBotInfo(prev => ({
          ...prev,
          lastProcessedId: messages[messages.length - 1].message.message_id
        }));
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  };

  const toggleForwarding = async () => {
    setIsForwarding(!isForwarding);
    if (!isForwarding && botInfo.apiKey && botInfo.receiverChatId) {
      await getUpdates(botInfo.apiKey);
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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isForwarding && botInfo.apiKey && botInfo.receiverChatId) {
      interval = setInterval(async () => {
        await getUpdates(botInfo.apiKey);
      }, 3000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isForwarding, botInfo.apiKey, botInfo.receiverChatId]);

  return (
    <DraggableWindow
      title="Telegram Bot Forwarder"
      isMinimized={isMinimized}
      onMinimize={() => setIsMinimized(true)}
      onMaximize={() => {}}
      onClose={() => setIsWindowVisible(false)}
      icon="/favicon.ico"
      className="bg-[#221F26] text-[#D6BCFA]"
    >
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <span className="font-montserrat flex items-center gap-2">
            <Database className="w-4 h-4 text-[#9b87f5]" />
            Статус БД: {dbStatus}
          </span>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <button 
              className="win98-button bg-[#221F26] border-[#9b87f5] text-[#D6BCFA] hover:bg-[#2a2533] w-full md:w-auto"
              onClick={() => setDbStatus(prev => prev === "Отключено" ? "Подключено" : "Отключено")}
            >
              {dbStatus === "Отключено" ? "Подключить" : "Отключить"}
            </button>
            <button 
              className={`win98-button ${isForwarding ? 'bg-[#ea384c]' : 'bg-[#9b87f5]'} text-white w-full md:w-auto`}
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

        <div className="grid grid-cols-1 gap-4 md:gap-8">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <label className="font-montserrat">API Ключ</label>
              <Input
                className="win98-input h-10 md:h-12 text-base md:text-lg bg-[#2a2533] border-[#9b87f5] text-[#D6BCFA]"
                placeholder="Введите API ключ Telegram бота"
                value={botInfo.apiKey}
                onChange={(e) => {
                  setBotInfo(prev => ({ ...prev, apiKey: e.target.value }));
                  if (e.target.value.length > 20) {
                    fetchBotName(e.target.value);
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="font-montserrat">ID Чата получателя</label>
              <Input
                className="win98-input h-10 md:h-12 text-base md:text-lg bg-[#2a2533] border-[#9b87f5] text-[#D6BCFA]"
                placeholder="Введите ID чата получателя"
                value={botInfo.receiverChatId}
                onChange={(e) => setBotInfo(prev => ({ ...prev, receiverChatId: e.target.value }))}
              />
            </div>
          </div>

          {isForwarding && (
            <div className="mt-4">
              <div className="w-full bg-[#2a2533] rounded-full h-2.5">
                <div 
                  className="bg-[#9b87f5] h-2.5 rounded-full transition-all" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-[#8E9196] mt-2">
                Прогресс: {Math.round(progress)}%
              </p>
            </div>
          )}

          <div className="overflow-x-auto">
            <MessageTable messages={messages} />
          </div>
        </div>
      </div>
    </DraggableWindow>
  );
};