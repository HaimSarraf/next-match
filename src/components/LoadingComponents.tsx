import { Spinner } from "@nextui-org/react";
import React from "react";

export default function LoadingComponents({ label }: { label?: string }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center ">
      <Spinner
        label={label || "Loading..."}
        color="danger"
        labelColor="foreground"
      />
    </div>
  );
}
