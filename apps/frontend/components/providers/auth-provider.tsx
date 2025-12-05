"use client";

import { useMe } from "@/services/react-query/queries/use-me";
import {
  removeEmployeeInfo,
  removeUserInfo,
  setEmployeeInfo,
  setUserInfo,
} from "@/services/redux/slices/user-slice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, error } = useMe();
  const [isChecking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading) {
      if (!error && data) {
        dispatch(setUserInfo(data.user));
        dispatch(setEmployeeInfo(data.employee));
        if (pathname === "/login") {
          router.push("/");
        }
      } else {
        dispatch(removeUserInfo());
        dispatch(removeEmployeeInfo());
        if (pathname !== "/login") {
          router.push("/login");
        }
      }
    }
  }, [pathname, router, isLoading, error, data, dispatch]);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setChecking(false), 100);
    }
  }, [isLoading]);

  if (isChecking) return null;
  return children;
}
