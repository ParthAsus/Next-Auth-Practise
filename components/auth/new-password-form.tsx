"use client";

import { useForm } from "react-hook-form";
import CardWrapper from "./card-wrapper";
import { NewPassswordSchema } from "@/schemas";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import LoginPage from "@/app/auth/login/page";
import { LoginButton } from "./login-button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { newPassword } from "@/actions/new-password";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTransaction] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");



  const form = useForm<z.infer<typeof NewPassswordSchema>>({
    resolver: zodResolver(NewPassswordSchema),
    defaultValues: {
      password: "",
    },
  }); 

  const onSubmit = (values: z.infer<typeof NewPassswordSchema>) => {
    setSuccess("");
    setError("");

    console.log(values);
    startTransaction(() => {
      newPassword(values, token)
        .then((data) => {
          setSuccess(data?.success);
          setError(data?.error);
        })
        .catch((error) => {
          setError("");
        })
    })
  }
  return (
    <CardWrapper
      headerLabel="Enter a new a password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error}/>
          <FormSuccess message={success}/>
          <Button
            disabled={isPending}
            type="submit"  
            className="w-full"
          >
            <LoginButton>Reset Password</LoginButton>
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
