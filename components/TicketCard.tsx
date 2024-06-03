import { cn } from "@/lib/utils";
import { Ticket } from "@/models/Ticket";
import { useDraggable } from "@dnd-kit/core";
import MenuIcon from "./MenuIcon";
import { priorities } from "@/constants";
import TicketFormModal from "./TicketFormModal";
import { useState } from "react";

interface Props {
  ticket: Ticket;
}

const TicketCard = ({ ticket }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: ticket._id,
    data: {
      ticketId: ticket._id
    }
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }
    : undefined;

  const formatTimestamp = (timestamp: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    };

    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", options);
  };

  const openTicketModal = () => {
    setShowModal(true);
  };

  return (
    <>
      <div
        className="relative mb-4 w-[250px] rounded-sm border-none bg-zinc-950 p-4 hover:bg-primary"
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
      >
        <div className="absolute right-3 top-3">
          <MenuIcon id={ticket._id} openTicketModal={openTicketModal} />
        </div>

        <div className="mb-2 flex justify-between">
          <div className="scroll-m-20 text-lg font-bold">{ticket.title}</div>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm">
          <div>{formatTimestamp(ticket.createdAt)}</div>
          <div
            className={cn(
              "h-3 w-3 rounded-full",
              `bg-${priorities.find((p) => p.value === ticket.priority)?.color}`
            )}
          ></div>
        </div>
      </div>

      <TicketFormModal
        ticket={ticket}
        open={showModal}
        setOpen={setShowModal}
      />
    </>
  );
};

export default TicketCard;
