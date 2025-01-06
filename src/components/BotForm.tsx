import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const BotForm = ({ setIsLoading }: { setIsLoading: (loading: boolean) => void }) => {
  const [isMinimized, setIsMinimized] = useState(false);
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
              // Save to database here
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

  return (
    <div className={`win98-window max-w-4xl mx-auto ${isMinimized ? 'minimize-animation' : 'maximize-animation'}`}>
      <div className="win98-titlebar">
        <div className="flex items-center gap-2">
          <img src="/favicon.ico" alt="icon" className="w-4 h-4" />
          <span className="font-montserrat">Telegram Bot Forwarder</span>
        </div>
        <div className="flex gap-1">
          <button onClick={toggleMinimize} className="px-2 hover:bg-blue-700">_</button>
          <button className="px-2 hover:bg-blue-700">□</button>
          <button className="px-2 hover:bg-blue-700">×</button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <span className="font-montserrat">Статус БД: {dbStatus}</span>
          <div className="space-x-4">
            <button 
              className="win98-button"
              onClick={() => setDbStatus(prev => prev === "Отключено" ? "Подключено" : "Отключено")}
            >
              {dbStatus === "Отключено" ? "Подключить" : "Отключить"}
            </button>
            <button 
              className={`win98-button ${isForwarding ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
              onClick={toggleForwarding}
            >
              {isForwarding ? 'Остановить' : 'Начать'} пересылку
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-montserrat">API Ключ</label>
              <Input
                className="win98-input h-12 text-lg"
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
                <p className="text-sm font-montserrat">Имя бота: {botInfo.botName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="font-montserrat">ID Чата отправителя</label>
              <Input
                className="win98-input h-12 text-lg"
                placeholder="Введите ID чата отправителя"
                value={botInfo.senderChatId}
                onChange={(e) => setBotInfo(prev => ({ ...prev, senderChatId: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="font-montserrat">ID Чата получателя</label>
              <Input
                className="win98-input h-12 text-lg"
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
                className="win98-input h-12 text-lg"
                placeholder="ID сообщения"
                value={botInfo.messageId}
                onChange={(e) => setBotInfo(prev => ({ ...prev, messageId: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="font-montserrat">Текст сообщения (необязательно)</label>
              <Input
                className="win98-input h-12 text-lg"
                placeholder="Текст сообщения"
                value={botInfo.textMessage}
                onChange={(e) => setBotInfo(prev => ({ ...prev, textMessage: e.target.value }))}
              />
            </div>

            {isForwarding && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '50%' }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Последний обработанный ID: {botInfo.lastProcessedId}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};