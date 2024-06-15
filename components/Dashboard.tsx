"use client";

import KanbanColumn from "@/components/KanbanColumn/KanbanColumn";
import { statuses } from "@/constants";
import { editTicket, getTickets } from "@/lib/actions";
import { MouseSensor, TouchSensor } from "@/lib/sensors";
import { useTicketStore } from "@/lib/store";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const tickets = useTicketStore((state) => state.tickets);
  const setTickets = useTicketStore((state) => state.setTickets);
  const updateTicket = useTicketStore((state) => state.updateTicket);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const distanceSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  });
  const sensors = useSensors(mouseSensor, touchSensor, distanceSensor);

  useEffect(() => {
    if (session?.user.username) {
      getTickets(session.user.username).then((data) => {
        setTickets(data);
        setLoading(false);
      });
    }
  }, [session, setTickets]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const ticket = active.data.current!.ticket;
    const columnStatus = over?.data.current?.status;

    if (ticket && columnStatus && ticket.status !== columnStatus) {
      ticket.status = columnStatus;
      editTicket(ticket._id, ticket);
      updateTicket(ticket);
    }
  };

  if (loading)
    return (
      <div className="flex flex-grow items-center justify-center">
        <Loader2 size={50} className="animate-spin" />
      </div>
    );

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex flex-grow items-center justify-center gap-5">
        {statuses.map((status, index) => (
          <KanbanColumn
            key={index}
            id={index}
            status={status}
            tickets={tickets.filter((ticket) => ticket.status === status)}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default Dashboard;
