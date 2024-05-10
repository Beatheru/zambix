"use server";

import * as z from "zod";
import * as bcrypt from "bcryptjs";
import { Ticket } from "@/models/Ticket";
import { ticketFormSchema } from "@/models/FormSchema";
import { registerFormSchema } from "@/models/FormSchema";
import { User } from "@/models/User";

export const createTicket = async (
  form: z.infer<typeof ticketFormSchema>
): Promise<string | null> => {
  try {
    await Ticket.create({ ...form });
    return null;
  } catch (error) {
    return String(error);
  }
};

export const editTicket = async (
  id: string,
  form: z.infer<typeof ticketFormSchema>
): Promise<string | null> => {
  try {
    await Ticket.findByIdAndUpdate(id, {
      ...form
    });
    return null;
  } catch (error) {
    return String(error);
  }
};

export const deleteTicket = async (id: string): Promise<string | null> => {
  try {
    await Ticket.findByIdAndDelete(id);
    return null;
  } catch (error) {
    return String(error);
  }
};

export const searchUsers = async (username: string): Promise<string[]> => {
  try {
    if (username.length > 0) {
      const users = (
        await User.find<User>({
          username
        })
      ).map((user) => user.username);
      return users;
    } else {
      const users = (await User.find<User>()).map((user) => user.username);
      return users;
    }
  } catch (error) {
    return [];
  }
};

export const registerUser = async (
  form: z.infer<typeof registerFormSchema>
) => {
  try {
    const { username, password } = form;
    const user = await User.findOne({
      username: { $regex: username, $options: "i" }
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create<User>({ username, password: hashedPassword });
      return null;
    } else {
      return "User already exists";
    }
  } catch (error) {
    return String(error);
  }
};
