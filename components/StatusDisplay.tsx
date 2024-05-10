import { cn } from "@/lib/utils";

interface Props {
  status: string;
}

const StatusDisplay = ({ status }: Props) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "done":
        return "bg-green-500";
      case "started":
        return "bg-yellow-200";
      case "not started":
        return "bg-red-400";
    }
  };

  return (
    <span
      className={cn(
        "inline-block rounded-[5px] px-2 py-1 text-xs font-semibold text-gray-700",
        getStatusColor(status)
      )}
    >
      {status}
    </span>
  );
};

export default StatusDisplay;
