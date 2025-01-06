import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface BotFormProps {
  setIsLoading: (loading: boolean) => void;
}

export const BotForm = ({ setIsLoading }: BotFormProps) => {
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

  const fetchBotName = async (apiKey: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.telegram.org/bot${apiKey}/getMe`);
      const data = await response.json();
      if (data.ok) {
        setBotInfo(prev => ({ ...prev, botName: data.result.first_name }));
      }
    } catch (error) {
      console.error('Error fetching bot name:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            placeholder="Enter your Telegram Bot API Key"
            className="form-input"
            value={botInfo.apiKey}
            onChange={(e) => {
              setBotInfo(prev => ({ ...prev, apiKey: e.target.value }));
              if (e.target.value.length > 20) {
                fetchBotName(e.target.value);
              }
            }}
          />
          {botInfo.botName && (
            <p className="text-sm text-gray-500 mt-1">Bot Name: {botInfo.botName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="senderChatId">Sender Chat ID</Label>
          <Input
            id="senderChatId"
            placeholder="Enter sender chat ID"
            className="form-input"
            value={botInfo.senderChatId}
            onChange={(e) => setBotInfo(prev => ({ ...prev, senderChatId: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="receiverChatId">Receiver Chat ID</Label>
          <Input
            id="receiverChatId"
            placeholder="Enter receiver chat ID"
            className="form-input"
            value={botInfo.receiverChatId}
            onChange={(e) => setBotInfo(prev => ({ ...prev, receiverChatId: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="messageId">Message ID</Label>
          <Input
            id="messageId"
            placeholder="Enter message ID"
            className="form-input"
            value={botInfo.messageId}
            onChange={(e) => setBotInfo(prev => ({ ...prev, messageId: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="textMessage">Message Text</Label>
          <Input
            id="textMessage"
            placeholder="Enter message text"
            className="form-input"
            value={botInfo.textMessage}
            onChange={(e) => setBotInfo(prev => ({ ...prev, textMessage: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
};