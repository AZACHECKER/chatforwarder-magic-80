import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BotMessage } from "@/utils/botDataService";

interface MessageTableProps {
  messages: BotMessage[];
}

export const MessageTable = ({ messages }: MessageTableProps) => {
  return (
    <div className="rounded-md border border-[#9b87f5] bg-[#221F26] text-[#D6BCFA]">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#9b87f5]">
            <TableHead className="text-[#D6BCFA]">ID</TableHead>
            <TableHead className="text-[#D6BCFA]">Message</TableHead>
            <TableHead className="text-[#D6BCFA]">Sender ID</TableHead>
            <TableHead className="text-[#D6BCFA]">Receiver ID</TableHead>
            <TableHead className="text-[#D6BCFA]">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id} className="border-b border-[#9b87f5]">
              <TableCell className="text-[#D6BCFA]">{message.messageId}</TableCell>
              <TableCell className="text-[#D6BCFA]">{message.textMessage}</TableCell>
              <TableCell className="text-[#D6BCFA]">{message.senderChatId}</TableCell>
              <TableCell className="text-[#D6BCFA]">{message.receiverChatId}</TableCell>
              <TableCell className="text-[#D6BCFA]">
                {new Date(message.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};