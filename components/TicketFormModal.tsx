"use client";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { priorities, statuses } from "@/constants";
import {
  createTicket,
  editTicket,
  getTickets,
  searchUsers
} from "@/lib/actions";
import { useTicketStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ticketFormSchema } from "@/models/FormSchema";
import { Ticket } from "@/models/Ticket";
import { faCheck, faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommandList } from "cmdk";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  ticket?: Ticket;
  initialState?: Partial<Ticket>;
}

const TicketFormModal = ({ open, setOpen, ticket, initialState }: Props) => {
  const isEditing = !!ticket;
  const setTickets = useTicketStore((state) => state.setTickets);
  const { data: session } = useSession();

  const [userListOpen, setUserListOpen] = useState(false);
  const [userListLoading, setUserListLoading] = useState(false);
  const [userList, setUserList] = useState<string[]>([]);

  const form = useForm<z.infer<typeof ticketFormSchema>>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: isEditing ? ticket?.title : initialState?.title ?? "",
      assignTo: isEditing ? ticket?.assignTo : initialState?.assignTo ?? [],
      description: isEditing
        ? ticket?.description
        : initialState?.description ?? "",
      priority: isEditing ? ticket?.priority : initialState?.priority ?? "",
      status: isEditing ? ticket?.status : initialState?.status ?? ""
    }
  });

  const handleSearchUsers = (search: string) => {
    setUserList([]);
    setUserListLoading(true);
    searchUsers(search).then((res) => {
      setUserListLoading(false);
      setUserList(res);
    });
  };

  const onSubmit = async (values: z.infer<typeof ticketFormSchema>) => {
    let err = null;
    if (isEditing) {
      err = await editTicket(ticket!._id, values);
    } else {
      err = await createTicket(values);
    }

    if (err) {
      console.log(err);
      toast.error("Failed to save, please try again");
      return;
    }

    const tickets = await getTickets(session!.user.username!);
    setTickets(tickets);
    setOpen(false);
  };

  useEffect(() => {
    if (isEditing) {
      handleSearchUsers("");
    }
  }, [isEditing]);

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Edit Ticket: ${ticket.title}` : "Create Ticket"}
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-100 mt-5 flex flex-col justify-center gap-5 text-foreground"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assignTo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Assign To</FormLabel>
                      <Popover
                        open={userListOpen}
                        onOpenChange={(open) => {
                          setUserListOpen(open);
                          if (open) {
                            handleSearchUsers("");
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={userListOpen}
                              className={cn(
                                "w-fit min-w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value.length > 0
                                ? userList
                                    .reduce((acc, user) => {
                                      if (field.value.includes(user)) {
                                        acc += user + ", ";
                                      }
                                      return acc;
                                    }, "")
                                    .slice(0, -2)
                                : "Select user"}
                              <FontAwesomeIcon
                                icon={faSort}
                                className="ml-2 h-4 w-4 shrink-0 opacity-50"
                              />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search user"
                              className="h-9"
                              onValueChange={(search) =>
                                handleSearchUsers(search)
                              }
                            />
                            {userListLoading ? (
                              <div className="flex justify-center py-6 text-sm">
                                <Spinner size={25} />
                              </div>
                            ) : (
                              <CommandEmpty>No users found.</CommandEmpty>
                            )}
                            <CommandGroup>
                              <CommandList>
                                {userList.map((user) => (
                                  <CommandItem
                                    value={user}
                                    key={user}
                                    onSelect={() => {
                                      if (field.value.includes(user)) {
                                        field.onChange(
                                          field.value.filter((u) => u !== user)
                                        );
                                      } else {
                                        field.onChange([...field.value, user]);
                                      }
                                      form.clearErrors("assignTo");
                                    }}
                                  >
                                    {user}

                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        field.value.indexOf(user) >= 0
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          className="resize-none"
                          {...field}
                          rows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorities.map((priority, i) => (
                            <SelectItem key={i} value={priority.value}>
                              {priority.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statuses.map((status, i) => (
                            <SelectItem key={i} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">
                  {isEditing ? "Update Ticket" : "Create Ticket"}
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TicketFormModal;
