export interface BotMessage {
  id: number;
  apiKey: string;
  senderChatId: string;
  receiverChatId: string;
  messageId: string;
  textMessage: string;
  timestamp: string;
}

export const saveBotData = (data: Omit<BotMessage, "id" | "timestamp">) => {
  const messages = getBotMessages();
  const newMessage = {
    ...data,
    id: messages.length + 1,
    timestamp: new Date().toISOString()
  };
  
  messages.push(newMessage);
  localStorage.setItem('botMessages', JSON.stringify(messages));
  return newMessage;
};

export const getBotMessages = (): BotMessage[] => {
  const messages = localStorage.getItem('botMessages');
  return messages ? JSON.parse(messages) : [];
};

export const clearBotMessages = () => {
  localStorage.setItem('botMessages', JSON.stringify([]));
};

export const forwardMessage = async (
  apiKey: string, 
  text: string, 
  receiverChatId: string
): Promise<boolean> => {
  try {
    const response = await fetch(`https://api.telegram.org/bot${apiKey}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: receiverChatId,
        text: text,
      }),
    });
    
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Error forwarding message:', error);
    return false;
  }
};