import AddIcon from "@/components/AddIcon";
import TicketCard from "@/components/TicketCard";
import { cn } from "@/lib/utils";
import { Ticket } from "@/models/Ticket";
import { useDroppable } from "@dnd-kit/core";

interface Props {
  id: string | number;
  status: string;
  tickets: Ticket[];
}

const KanbanColumn = ({ id, status, tickets }: Props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: {
      status: status
    }
  });

  return (
    <div className="flex h-[95%] flex-col items-center">
      <div className="flex w-[90%] items-center justify-between">
        <div className="flex items-center gap-2 font-bold">
          <div className="text-primary"> {status} </div>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-sm">
            {tickets.length}
          </div>
        </div>
        <AddIcon status={status} />
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "m-2 flex h-full flex-col items-center rounded-sm bg-zinc-900 p-3",
          isOver ? "border border-dashed border-primary" : ""
        )}
      >
        <div className="w-[250px]"></div>
        {tickets.map((ticket, index) => (
          <TicketCard key={index} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
