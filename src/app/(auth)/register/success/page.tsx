"use client";

import CardWrapper from "@/components/CardWrapper";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";

export default function RegisterSuccessPage() {
  const router = useRouter();

  return (
    <CardWrapper
      headerText="Successfully Registered"
      subHeaderText="Now You Can Login The App"
      action={() => router.push("/login")}
      actionLabel="Go To Login-Page"
      headerIcon={FaCheckCircle}
    />
  );
}
