import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import TicketCard from "@/components/TicketCard";
import { Ticket } from "@/models/Ticket";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket } from "@fortawesome/free-solid-svg-icons";

const getTickets = async () => {
  const session = await getServerSession(authOptions);
  const res = await Ticket.find<Ticket>({
    assignTo: session?.user.username
  });

  const tickets = res.map((ticket) => JSON.parse(JSON.stringify(ticket)));

  return tickets;
};

const Dashboard = async () => {
  const tickets = await getTickets();

  return (
    <div className="p-5 pt-24">
      <div className="mb-4 flex justify-between">
        <div className="text-3xl font-bold">My Tickets</div>

        <Link href="/new">
          <Button className="flex gap-2">
            <FontAwesomeIcon icon={faTicket} className="icon" />
            <div>New Ticket</div>
          </Button>
        </Link>
      </div>
      <div>
        {tickets && (
          <div className="flex flex-wrap gap-4">
            {tickets.map((ticket, index) => (
              <TicketCard key={index} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
