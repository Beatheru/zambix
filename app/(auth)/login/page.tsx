"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import { loginFormSchema } from "@/models/FormSchema";

const Error = ({ error }: { error: string }) => {
  if (error) return <div className="text-center text-red-500">{error}</div>;
  else return null;
};

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      ...values,
      redirect: false
    });

    setLoading(false);

    if (res?.ok) {
      router.push("/");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-screen items-center justify-center"
      >
        <Card className="w-[350px] border-primary bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">
              Login to your account
            </CardTitle>
            <Error error={error} />
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-0 bg-slate-900 focus-visible:border focus-visible:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="border-0 bg-slate-900 focus-visible:border focus-visible:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex flex-col items-center gap-4">
            <Button type="submit" className="w-full">
              {loading ? <Spinner size={25} /> : "Login"}
            </Button>

            <div className="flex text-sm">
              <div className="text-gray-400"> No account? &nbsp; </div>
              <Link href="/register" className="text-primary">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default LoginPage;
