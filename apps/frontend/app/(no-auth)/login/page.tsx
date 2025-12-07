"use client";

import { setCookie } from "@/services/cookies/cookies";
import { persitStore } from "@/services/persit-store/store";
import { useLogin } from "@/services/react-query/mutations/use-login";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Inputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const [isRemember, setRemember] = useState(persitStore.states.isRemember);
  const { register, handleSubmit, watch } = useForm<Inputs>({
    defaultValues: {
      email: persitStore.states.savedLoginInfo?.email ?? "",
      password: persitStore.states.savedLoginInfo?.password ?? "",
    },
  });
  const { mutateAsync: login, isPending: isPendingLogin } = useLogin();
  const email = watch("email");
  const password = watch("password");

  useEffect(() => {
    if (isRemember) {
      persitStore.actions.setLoginInfo({
        email,
        password,
      });
    } else {
      persitStore.actions.removeLoginInfo();
    }
  }, [isRemember, email, password]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, password } = data;
    try {
      const result = await login({ email, password });
      if (!result) return;
      const { accessToken, accessExpiresAt } = result;
      await setCookie("access_token", accessToken, new Date(accessExpiresAt));
      window.location.reload();
    } catch (err) {
      const _err = err as AxiosError;
      if (_err.response?.status === 404) {
        return toast("Invalid email or password", {
          type: "error",
        });
      }
      toast("Something error. Please try again", {
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl border border-muted p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-foreground/70">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <div className="block text-sm mb-1 text-foreground">Email</div>
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="
                                w-full rounded-lg px-4 py-2
                                bg-background
                                text-[color:var(--theme-primary)]
                                border border-muted
                                outline-none
                                focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <div className="block text-sm mb-1 text-foreground">Password</div>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="
                            w-full rounded-lg px-4 py-2
                            bg-background
                            border border-muted
                            outline-none 
                          text-[color:var(--theme-primary)]
                            focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-foreground">
              <input
                type="checkbox"
                checked={isRemember}
                onChange={() => {
                  setRemember((prev) => !prev);
                  persitStore.actions.toggleRemeber();
                }}
                className="accent-primary"
              />
              Remember me
            </label>

            <a href="asd" className="text-secondary hover:underline">
              Forgot?
            </a>
          </div>
          <button
            type="submit"
            disabled={isPendingLogin}
            className="
                        w-full py-2.5 rounded-lg
                        bg-[color:var(--theme-primary)]
                        text-white font-medium
                        hover:opacity-90
                        cursor-pointer
                        transition 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        "
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-foreground/70">
          © 2025 SmartHMM
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
