"use client";

import KanbanColumn from "@/components/KanbanColumn";
import Spinner from "@/components/Spinner";
import { statuses } from "@/constants";
import { getTickets } from "@/lib/actions";
import { MouseSensor, TouchSensor } from "@/lib/sensors";
import { useTicketStore } from "@/lib/store";
import { DndContext, DragEndEvent, useSensor, useSensors } from "@dnd-kit/core";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const tickets = useTicketStore((state) => state.tickets);
  const setTickets = useTicketStore((state) => state.setTickets);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

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
    console.log(active, over);
  };

  if (loading)
    return (
      <div className="flex flex-grow items-center justify-center">
        <Spinner size={50} />
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
