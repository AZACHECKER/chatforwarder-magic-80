import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const DataTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      apiKey: "sample_key",
      senderChatId: "123456",
      receiverChatId: "789012",
      messageId: "1",
      textMessage: "Hello World"
    }
  ]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>API Key</TableHead>
            <TableHead>Sender Chat ID</TableHead>
            <TableHead>Receiver Chat ID</TableHead>
            <TableHead>Message ID</TableHead>
            <TableHead>Text Message</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.apiKey}</TableCell>
              <TableCell>{item.senderChatId}</TableCell>
              <TableCell>{item.receiverChatId}</TableCell>
              <TableCell>{item.messageId}</TableCell>
              <TableCell>{item.textMessage}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setData(data.filter((d) => d.id !== item.id));
                  }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};