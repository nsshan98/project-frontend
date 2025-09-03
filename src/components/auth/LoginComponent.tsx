"use client";
import {
  Form,
  FormControl,
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
import { doUserSignIn } from "@/action/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginComponent = () => {
  const router = useRouter();
  const loginForm = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await doUserSignIn(formData);
      if (!response?.error) {
        router.push("/dashboard");
        toast("Login Successful");
      }
    } catch (error) {
      if (error) {
        toast(
          "Login Failed. Please check your credentials and try again."
        );
      }
    }
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
                    endIcon={
                      showPassword ? (
                        <GoEyeClosed
                          onClick={() => setShowPassword(!showPassword)}
                        />
                      ) : (
                        <GoEye onClick={() => setShowPassword(!showPassword)} />
                      )
                    }
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
