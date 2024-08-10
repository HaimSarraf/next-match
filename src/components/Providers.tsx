"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

interface Props {
  children: React.ReactNode;
}

function Providers({ children }: Props) {
  return (
    <NextUIProvider>
      <ToastContainer
        position="bottom-center"
        hideProgressBar
        className="z-50 text-center font-bold"
      />

      {children}
    </NextUIProvider>
  );
}

export default Providers;
