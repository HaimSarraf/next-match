"use client";

import { generateResetPasswordEmail } from "@/app/actions/authActions";
import { ActionResults } from "@/app/types";
import CardWrapper from "@/components/CardWrapper";
import ResultMessage from "@/components/ResultMessage";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";

export default function ForgotPasswordForm() {
  const [result, setResult] = useState<ActionResults<string> | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    setResult(await generateResetPasswordEmail(data.email));

    reset();
  };

  return (
    <CardWrapper
      headerIcon={GiPadlock}
      headerText="Forgot Password"
      subHeaderText="Please Enter Your Email-Address So We Send You A Link To Reset Your Current Password"
      body={
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 text-balance text-warning-400"
        >
          <Input
            type="email"
            placeholder="Email Address"
            variant="bordered"
            defaultValue=""
            {...register("email", { required: true })}
          />
          <Button
            type="submit"
            color="warning"
            isLoading={isSubmitting}
            isDisabled={!isValid}
            fullWidth
          >
            Send Reset Email
          </Button>
        </form>
      }
      footer={<ResultMessage result={result} />}
    />
  );
}
