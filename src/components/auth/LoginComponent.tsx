"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../atoms/form";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaType } from "@/zod/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import { useState } from "react";

const LoginComponent = () => {
  const loginForm = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginSchemaType) => {
    console.log(data);
  };
  return (
    <div className="max-w-md h-dvh mx-auto my-auto flex flex-col justify-center">
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-amber-50">Email</FormLabel>
                <FormControl>
                  <Input
                    className="bg-amber-50"
                    placeholder="email@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-amber-50">Password</FormLabel>
                <FormControl>
                  <Input
                    className="bg-amber-50"
                    placeholder="********"
                    type={showPassword ? "text" : "password"}
                    endIcon={showPassword ? <GoEyeClosed onClick={() => setShowPassword(!showPassword)} /> : <GoEye onClick={() => setShowPassword(!showPassword)} />}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginComponent;
