import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const BotForm = ({ setIsLoading }: { setIsLoading: (loading: boolean) => void }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [dbStatus, setDbStatus] = useState("Отключено");
  const { toast } = useToast();
  const [botInfo, setBotInfo] = useState({
    apiKey: '',
    botName: '',
    senderChatId: '',
    senderChatName: '',
    receiverChatId: '',
    receiverChatName: '',
    messageId: '',
    textMessage: ''
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

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`win98-window ${isMinimized ? 'minimize-animation' : 'maximize-animation'}`}>
      <div className="win98-titlebar">
        <div className="flex items-center gap-2">
          <img src="/favicon.ico" alt="icon" className="w-4 h-4" />
          <span>Telegram Bot Forwarder</span>
        </div>
        <div className="flex gap-1">
          <button onClick={toggleMinimize} className="px-2 hover:bg-blue-700">_</button>
          <button className="px-2 hover:bg-blue-700">□</button>
          <button className="px-2 hover:bg-blue-700">×</button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <span>Статус БД: {dbStatus}</span>
          <button 
            className="win98-button"
            onClick={() => setDbStatus(prev => prev === "Отключено" ? "Подключено" : "Отключено")}
          >
            {dbStatus === "Отключено" ? "Подключить" : "Отключить"}
          </button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label>API Ключ</label>
              <Input
                className="win98-input"
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
                <p className="text-sm">Имя бота: {botInfo.botName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label>ID Чата отправителя</label>
              <Input
                className="win98-input"
                placeholder="Введите ID чата отправителя"
                value={botInfo.senderChatId}
                onChange={(e) => setBotInfo(prev => ({ ...prev, senderChatId: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label>ID Чата получателя</label>
              <Input
                className="win98-input"
                placeholder="Введите ID чата получателя"
                value={botInfo.receiverChatId}
                onChange={(e) => setBotInfo(prev => ({ ...prev, receiverChatId: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label>ID Сообщения</label>
              <Input
                className="win98-input"
                placeholder="Введите ID сообщения"
                value={botInfo.messageId}
                onChange={(e) => setBotInfo(prev => ({ ...prev, messageId: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label>Текст сообщения</label>
              <Input
                className="win98-input"
                placeholder="Введите текст сообщения"
                value={botInfo.textMessage}
                onChange={(e) => setBotInfo(prev => ({ ...prev, textMessage: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};