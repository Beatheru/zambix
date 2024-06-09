export type Priority = "Low" | "Medium" | "High";
export const priorities = [
  {
    value: "Low",
    color: "green-500"
  },
  {
    value: "Medium",
    color: "yellow-200"
  },
  {
    value: "High",
    color: "red-400"
  }
];

export type Status = "Not Started" | "Started" | "Done";
export const statuses: Status[] = ["Not Started", "Started", "Done"];
