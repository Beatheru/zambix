"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { deleteTicket } from "@/lib/actions";
import { useTicketStore } from "@/lib/store";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";

interface Props {
  id: string;
  openTicketModal: () => void;
}

const MenuIcon = ({ id, openTicketModal }: Props) => {
  const deleteTicketFromStore = useTicketStore((state) => state.deleteTicket);

  const handleDelete = async () => {
    const err = await deleteTicket(id);
    if (!err) {
      deleteTicketFromStore(id);
      return;
    }

    console.log(err);
    toast.error("Failed to delete, please try again");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent data-no-dnd="true">
        <DropdownMenuItem onClick={openTicketModal}>Info</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuIcon;
