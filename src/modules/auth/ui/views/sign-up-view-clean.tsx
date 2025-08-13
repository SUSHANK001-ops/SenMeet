"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  OctagonAlert,
  Loader2,
  Github,
  Sparkles,
  Users,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const SignUpView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
      }
    );
  };

  const onSocial = (provider: "github" | "google") => {
    setError(null);
    setPending(true);
    authClient.signIn.social(
      {
        provider: provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
      }
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const floatingIconVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-sm">
          <CardContent className="grid p-0 md:grid-cols-2 min-h-[700px]">
            <Form {...form}>
              <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-8 md:p-12 flex flex-col justify-center relative"
                variants={containerVariants}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-purple-50/20 opacity-30"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-2xl"></div>

                <div className="flex flex-col gap-6 max-w-sm mx-auto w-full relative z-10">
                  <motion.div
                    className="flex flex-col items-center text-center space-y-2"
                    variants={itemVariants}
                  >
                    <motion.div
                      className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Users className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      Create Account
                    </h1>
                    <p className="text-muted-foreground">
                      Enter your information to create your account
                    </p>
                  </motion.div>

                  <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                  >
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium flex items-center gap-2">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                whileHover={{ scale: 1.01 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                }}
                              >
                                <Input
                                  type="text"
                                  placeholder="Enter your full name"
                                  className="h-11 border-2 transition-all duration-300 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
                                  {...field}
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Email
                            </FormLabel>
                            <FormControl>
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                whileHover={{ scale: 1.01 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                }}
                              >
                                <Input
                                  type="email"
                                  placeholder="Enter your email"
                                  className="h-11 border-2 transition-all duration-300 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
                                  {...field}
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Password
                            </FormLabel>
                            <FormControl>
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                whileHover={{ scale: 1.01 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                }}
                              >
                                <Input
                                  type="password"
                                  placeholder="Enter your password"
                                  className="h-11 border-2 transition-all duration-300 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
                                  {...field}
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Confirm Password
                            </FormLabel>
                            <FormControl>
                              <motion.div
                                whileFocus={{ scale: 1.02 }}
                                whileHover={{ scale: 1.01 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                }}
                              >
                                <Input
                                  type="password"
                                  placeholder="Confirm your password"
                                  className="h-11 border-2 transition-all duration-300 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20"
                                  {...field}
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </motion.div>

                  <AnimatePresence>
                    {!!error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert className="bg-destructive/10 border-destructive/20 text-destructive shadow-lg">
                          <motion.div
                            animate={{ rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <OctagonAlert className="h-4 w-4" />
                          </motion.div>
                          <AlertTitle className="text-sm font-medium">
                            {error}
                          </AlertTitle>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={itemVariants}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={pending}
                      >
                        {pending ? (
                          <motion.div
                            className="flex items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Loader2 className="mr-2 h-4 w-4" />
                            </motion.div>
                            Creating account...
                          </motion.div>
                        ) : (
                          <motion.div
                            className="flex items-center gap-2"
                            whileHover={{ x: 2 }}
                          >
                            <Sparkles className="w-4 h-4" />
                            Create account
                          </motion.div>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>

                  <motion.div className="relative" variants={itemVariants}>
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground font-medium">
                        Or continue with
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-2 gap-3"
                    variants={containerVariants}
                  >
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => onSocial("google")}
                        className="w-full h-11 border-2 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                        disabled={pending}
                      >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Google
                      </Button>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => onSocial("github")}
                        className="w-full h-11 border-2 hover:border-gray-400 hover:shadow-md transition-all duration-300"
                        disabled={pending}
                      >
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                      </Button>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="text-center text-sm"
                    variants={itemVariants}
                  >
                    Already have an account?{" "}
                    <motion.div
                      className="inline-block"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Link
                        className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
                        href="/sign-in"
                      >
                        Sign in
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.form>
            </Form>

            {/* Enhanced Right Panel */}
            <motion.div
              className="relative hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 md:flex flex-col gap-y-6 items-center justify-center p-8 overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Background Elements */}
              <div className="absolute inset-0">
                <motion.div
                  className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute bottom-20 right-16 w-16 h-16 bg-white/10 rounded-full"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
                <motion.div
                  className="absolute top-1/2 right-8 w-12 h-12 bg-white/10 rounded-full"
                  animate={{
                    y: [-20, 20, -20],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                />
              </div>

              <motion.div
                className="text-center space-y-4 relative z-10"
                variants={containerVariants}
              >
                <motion.div
                  className="mx-auto relative"
                  variants={floatingIconVariants}
                  animate="animate"
                >
                  <div className="p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20">
                    <Image
                      src="/logo.svg"
                      alt="SenMeet"
                      width={80}
                      height={80}
                      className="mx-auto"
                    />
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1"
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-800" />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Join SenMeet
                  </h2>
                  <p className="text-blue-100 text-lg">
                    Start your journey with us today
                  </p>
                </motion.div>

                {/* Feature highlights */}
                <motion.div
                  className="grid gap-4 mt-8 max-w-xs"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg p-3"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <Shield className="w-5 h-5 text-green-300" />
                    <span className="text-sm">Secure & Private</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-3 text-white/90 bg-white/10 backdrop-blur-sm rounded-lg p-3"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <Users className="w-5 h-5 text-blue-300" />
                    <span className="text-sm">Connect Easily</span>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute bottom-8 left-8 right-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <p className="text-blue-100 text-sm">
                  Join thousands of users already using SenMeet
                </p>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="text-center text-xs text-muted-foreground"
        variants={itemVariants}
      >
        By creating an account, you agree to our{" "}
        <motion.div className="inline-block" whileHover={{ scale: 1.05 }}>
          <Link
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>
        </motion.div>{" "}
        and{" "}
        <motion.div className="inline-block" whileHover={{ scale: 1.05 }}>
          <Link
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
