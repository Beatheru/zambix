import TicketForm from "@/components/TicketForm";
import { Ticket } from "@/models/Ticket";

const getTicket = async (id: string) => {
  const ticket = await Ticket.findById<Ticket>(id);
  return JSON.parse(JSON.stringify(ticket)) as Ticket;
};

const TicketPage = async ({ params }: { params: { id: string } }) => {
  const ticket = await getTicket(params.id);

  return <TicketForm ticket={ticket} />;
};

export default TicketPage;
