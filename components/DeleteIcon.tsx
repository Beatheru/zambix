"use client";

import { deleteTicket } from "@/lib/actions";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  id: string;
}

const DeleteIcon = ({ id }: Props) => {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const err = await deleteTicket(id);
    if (!err) {
      router.refresh();
      return;
    }

    console.log(err);
    toast.error("Failed to delete, please try again");
  };

  return (
    <FontAwesomeIcon
      icon={faX}
      className=" text-red-400 hover:cursor-pointer hover:text-red-200"
      onClick={handleDelete}
      height={15}
      width={15}
    />
  );
};

export default DeleteIcon;
