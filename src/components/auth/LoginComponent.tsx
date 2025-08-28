// "use client";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "../atoms/form";
// import { useForm } from "react-hook-form";
// import { loginSchema, LoginSchemaType } from "@/zod/auth-schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "../atoms/button";
// import { Input } from "../atoms/input";
// import { GoEye } from "react-icons/go";
// import { GoEyeClosed } from "react-icons/go";
// import { useState } from "react";

// const LoginComponent = () => {
//   const loginForm = useForm<LoginSchemaType>({
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//     resolver: zodResolver(loginSchema),
//   });

//   const [showPassword, setShowPassword] = useState(false);

//   const onSubmit = (data: LoginSchemaType) => {
//     console.log(data);
//   };
//   return (
//     <div className="max-w-md h-dvh mx-auto my-auto flex flex-col justify-center">
//       <Form {...loginForm}>
//         <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-8">
//           <FormField
//             control={loginForm.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-amber-50">Email</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="bg-amber-50"
//                     placeholder="email@example.com"
//                     type="email"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={loginForm.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="text-amber-50">Password</FormLabel>
//                 <FormControl>
//                   <Input
//                     className="bg-amber-50"
//                     placeholder="********"
//                     type={showPassword ? "text" : "password"}
//                     endIcon={showPassword ? <GoEyeClosed onClick={() => setShowPassword(!showPassword)} /> : <GoEye onClick={() => setShowPassword(!showPassword)} />}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button type="submit">Submit</Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default LoginComponent;



'use client'

import { signIn, getSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginComponent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials')
      } else {
        // Force session refresh to get latest tokens
        await getSession()
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('An error occurred during sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}