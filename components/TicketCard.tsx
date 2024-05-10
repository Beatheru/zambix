import Link from "next/link";
import DeleteIcon from "./DeleteIcon";
import StatusDisplay from "./StatusDisplay";
import { Ticket } from "@/models/Ticket";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  ticket: Ticket;
}

const TicketCard = ({ ticket }: Props) => {
  const formatTimestamp = (timestamp: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    };

    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", options);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-200";
      case "high":
        return "text-red-400";
    }
  };

  return (
    <Link href={`/tickets/${ticket._id}`} style={{ display: "contents" }}>
      <Card className="mb-4 w-[450px] border-none hover:bg-primary">
        <CardHeader>
          <CardTitle>
            <div className="mb-2 flex justify-between">
              <div className="scroll-m-20 text-3xl font-bold tracking-tight">
                {ticket.title}
              </div>
              <div>
                <DeleteIcon id={ticket._id} />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{ticket.description}</p>

          <div className="mt-2 flex justify-between">
            <div className="my-1 flex flex-col gap-1 text-sm">
              <div className={`${getStatusColor(ticket.priority)}`}>
                {ticket.priority}
              </div>
              <div>{formatTimestamp(ticket.createdAt)}</div>
            </div>
            <div className="flex items-end">
              <StatusDisplay status={ticket.status} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TicketCard;
