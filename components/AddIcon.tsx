"use client";

import { Ticket } from "@/models/Ticket";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import TicketFormModal from "./TicketFormModal";

interface Props {
  status: string;
}

const AddIcon = ({ status }: Props) => {
  const [open, setOpen] = useState(false);
  const ticket: Partial<Ticket> = {
    title: "",
    assignTo: [],
    description: "",
    priority: "",
    status: status,
    active: true,
    createdAt: new Date().toISOString()
  };

  return (
    <>
      <CirclePlus
        size={20}
        className="hover:text-primary"
        onClick={() => setOpen(true)}
      />
      <TicketFormModal open={open} setOpen={setOpen} initialState={ticket} />
    </>
  );
};

export default AddIcon;
