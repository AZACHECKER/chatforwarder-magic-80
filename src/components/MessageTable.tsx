import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BotMessage } from "@/utils/botDataService";

interface MessageTableProps {
  messages: BotMessage[];
}

export const MessageTable = ({ messages }: MessageTableProps) => {
  return (
    <div className="rounded-md border border-[#9b87f5] bg-[#221F26] text-[#D6BCFA] overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#9b87f5]">
            <TableHead className="text-[#D6BCFA] whitespace-nowrap px-2 md:px-4">ID</TableHead>
            <TableHead className="text-[#D6BCFA] whitespace-nowrap px-2 md:px-4">Message</TableHead>
            <TableHead className="text-[#D6BCFA] whitespace-nowrap px-2 md:px-4">Sender ID</TableHead>
            <TableHead className="text-[#D6BCFA] whitespace-nowrap px-2 md:px-4">Receiver ID</TableHead>
            <TableHead className="text-[#D6BCFA] whitespace-nowrap px-2 md:px-4">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id} className="border-b border-[#9b87f5]">
              <TableCell className="text-[#D6BCFA] px-2 md:px-4">{message.messageId}</TableCell>
              <TableCell className="text-[#D6BCFA] px-2 md:px-4">
                <div className="max-w-[150px] md:max-w-[300px] truncate">
                  {message.textMessage}
                </div>
              </TableCell>
              <TableCell className="text-[#D6BCFA] px-2 md:px-4">{message.senderChatId}</TableCell>
              <TableCell className="text-[#D6BCFA] px-2 md:px-4">{message.receiverChatId}</TableCell>
              <TableCell className="text-[#D6BCFA] px-2 md:px-4">
                {new Date(message.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};