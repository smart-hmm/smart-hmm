"use client";

import { setCookie } from "@/services/cookies/cookies";
import { persitStore } from "@/services/persit-store/store";
import { useLogin } from "@/services/react-query/mutations/use-login";
import type { AxiosError } from "axios";
import { Eye, EyeClosed, PersonStanding } from "lucide-react";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm, useWatch } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [isRemember, setRemember] = useState(persitStore.states.isRemember);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: persitStore.states.savedLoginInfo?.email ?? "",
      password: persitStore.states.savedLoginInfo?.password ?? "",
    },
  });

  const { mutateAsync: login, isPending: isPendingLogin } = useLogin();

  const email = useWatch({ control, name: "email" });
  const password = useWatch({ control, name: "password" });

  useEffect(() => {
    if (isRemember) {
      persitStore.actions.setLoginInfo({ email, password });
    } else {
      persitStore.actions.removeLoginInfo();
    }
  }, [isRemember, email, password]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setServerError(null);

      const result = await login(data);
      if (!result) return;

      const { accessToken, accessExpiresAt } = result;
      await setCookie("access_token", accessToken, new Date(accessExpiresAt));
      window.location.reload();
    } catch (err) {
      const _err = err as AxiosError;
      if ([401, 404].includes(_err.response?.status as number)) {
        setServerError("Invalid email or password.");
        return;
      }
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center px-4">
      <div
        className="absolute inset-0 -z-10 animate-gradient bg-size-[400%_400%]
        bg-linear-to-br from-primary/30 via-surface/30 to-secondary/30"
      />

      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-floatSlow" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-floatFast" />

      <div
        className="w-full max-w-[450px] bg-surface/80 backdrop-blur-xl border 
      border-gray-200 dark:border-white/10 rounded-xl shadow-xl p-10 transition-colors"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-surface font-semibold">
            <PersonStanding color="#fff" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">SmartHMM</h1>
          <p className="mt-1 text-md text-foreground/80">
            Enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-md font-medium text-foreground mb-1">
              Email
            </label>

            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format",
                },
              })}
              placeholder="you@company.com"
              className={`w-full rounded-lg border px-3 py-2 text-md bg-foreground/5 text-foreground placeholder-gray-400
                focus:outline-none focus:ring-2 focus:bg-foreground/10 transition
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-white/10 focus:ring-black dark:focus:ring-white"
                }
              `}
            />

            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-md font-medium text-foreground mb-1">
              Password
            </label>

            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Minimum 4 characters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full rounded-lg border px-3 py-2 text-md bg-foreground/5 text-foreground placeholder-gray-400 pr-10
                  focus:outline-none focus:ring-2 focus:bg-foreground/10 transition
                  ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-white/10 focus:ring-black dark:focus:ring-white"
                  }
                `}
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50
                 hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-md cursor-pointer text-foreground">
              <input
                type="checkbox"
                checked={isRemember}
                onChange={(e) => {
                  persitStore.actions.toggleRemeber();
                  setRemember(e.target.checked);
                }}
                className="rounded text-foreground focus:ring-primary accent-primary"
              />
              Remember me
            </label>

            <button
              type="button"
              className="text-md text-foreground/70 hover:text-foreground"
            >
              Forgot password?
            </button>
          </div>

          {serverError && (
            <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3 py-2 text-md text-red-600 dark:text-red-400">
              {serverError}
            </div>
          )}

          <button
            disabled={isPendingLogin}
            className="w-full rounded-lg bg-primary py-2.5 text-md font-medium text-white cursor-pointer
                     hover:opacity-90 transition disabled:opacity-60"
          >
            {isPendingLogin ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-8 text-center text-md text-foreground/80">
          Don’t have an account?{" "}
          <span className="text-foreground font-medium cursor-pointer hover:underline">
            Contact admin
          </span>
        </div>
      </div>
    </div>
  );
}
