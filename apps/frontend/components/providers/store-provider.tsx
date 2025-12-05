"use client";

import { store } from "@/services/redux/store";
import { Provider } from "react-redux";

interface Props {
  children: React.ReactNode;
}

const StoreProvider: React.FC<Props> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
