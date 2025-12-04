"use client";

import { toggleSideBar } from "@/services/redux/slices/appSlice";
import { RootState } from "@/services/redux/store";
import { useDispatch, useSelector } from "react-redux";

function UsersPage() {
  const app = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col justify-center h-screen">
      <h1 className="text-white">{app.display.isOpenSideBar ? 1 : 2}</h1>
      <br />
      <button type="button" onClick={() => dispatch(toggleSideBar())}>
        123
      </button>
    </div>
  );
}

export default UsersPage;
