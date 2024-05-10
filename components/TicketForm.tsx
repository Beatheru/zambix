"use client";

import { Ticket } from "@/models/Ticket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSort } from "@fortawesome/free-solid-svg-icons";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { createTicket, editTicket, searchUsers } from "@/lib/actions";
import { toast } from "sonner";
import { ticketFormSchema } from "@/models/FormSchema";
import { CommandList } from "cmdk";

interface Props {
  ticket?: Ticket;
}

const TicketForm = ({ ticket }: Props) => {
  const isEditing = ticket ? true : false;
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState<string[]>([]);

  const priorities = ["Low", "Medium", "High"];
  const statuses = ["Not Started", "Started", "Done"];

  const form = useForm<z.infer<typeof ticketFormSchema>>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: ticket?.title ?? "",
      assignTo: ticket?.assignTo ?? [],
      description: ticket?.description ?? "",
      priority: ticket?.priority ?? "",
      status: ticket?.status ?? ""
    }
  });

  const handleSearchUsers = (search: string) => {
    setUserList([]);
    setLoading(true);
    searchUsers(search).then((res) => {
      setLoading(false);
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

    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    if (isEditing) {
      handleSearchUsers("");
    }
  }, [isEditing]);

  return (
    <div className="mt-5 flex justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-1/2 flex-col gap-3 space-y-8"
        >
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {isEditing ? "Update Ticket" : "Create Ticket"}
          </h3>
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
                  open={open}
                  onOpenChange={(open) => {
                    setOpen(open);
                    handleSearchUsers("");
                  }}
                >
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
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
                        onValueChange={(search) => handleSearchUsers(search)}
                      />
                      {loading && (
                        <div className="p-1 text-center">Loading...</div>
                      )}
                      <CommandEmpty>No users found.</CommandEmpty>
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
                <FormDescription>User to assign this ticket to</FormDescription>
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
                      <SelectItem key={i} value={priority}>
                        {priority}
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
    </div>
  );
};

export default TicketForm;
