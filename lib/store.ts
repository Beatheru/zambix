import { Ticket } from "@/models/Ticket";
import { create } from "zustand";

interface StoreState {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  deleteTicket: (id: string) => void;
  updateTicket: (ticket: Ticket) => void;
}

export const useTicketStore = create<StoreState>((set) => ({
  tickets: [],
  setTickets: (tickets: Ticket[]) => set({ tickets: tickets }),
  addTicket: (ticket: Ticket) =>
    set((state: StoreState) => ({ tickets: [...state.tickets, ticket] })),
  deleteTicket: (id: string) =>
    set((state: StoreState) => ({
      tickets: state.tickets.filter((t) => t._id !== id)
    })),
  updateTicket: (ticket: Ticket) =>
    set((state: StoreState) => ({
      tickets: state.tickets.map((t) => (t._id === ticket._id ? ticket : t))
    }))
}));
