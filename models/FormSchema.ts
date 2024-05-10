import * as z from "zod";

export const loginFormSchema = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(1, { message: "Password is required" })
  })
  .required();

export const registerFormSchema = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    password: z.string().min(1, { message: "Please enter a password" })
  })
  .required();

export const ticketFormSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    assignTo: z.array(z.string()).min(1, { message: "User is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    priority: z.string().min(1, { message: "Priority is required" }),
    status: z.string().min(1, { message: "Status is required" })
  })
  .required();
