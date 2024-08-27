"use client";

import { registerUser } from "@/app/actions/authActions";
import {
  profileSchema,
  RegisterSchema,
  registerSchema,
} from "@/lib/schemas/registerSchema";
import { handleFormServerErrors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaKey } from "react-icons/fa";
import UserDetailsForm from "./UserDetailsForm";
import ProfileForm from "./ProfileForm";
import { useRouter } from "next/navigation";

const stepSchema = [registerSchema, profileSchema];

const RegisterForm = () => {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const currentValidationSchema = stepSchema[activeStep];

  const methods = useForm<RegisterSchema>({
    resolver: zodResolver(currentValidationSchema),
    mode: "onTouched",
  });

  const {
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
    getValues,
  } = methods;

  const onSubmit = async () => {
    const result = await registerUser(getValues());

    if (result.status === "success") {
      router.push("/register/success");
    } else {
      handleFormServerErrors(result, setError);
    }
    console.log(getValues());
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <UserDetailsForm />;
      case 1:
        return <ProfileForm />;
      default:
        return "Unknown Step";
    }
  };

  const onBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const onNext = async () => {
    if (activeStep === stepSchema.length - 1) {
      await onSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  return (
    <Card className="w-2/5 mt-40">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2 items-center text-orange-500">
          <div className="flex flex-row items-center gap-3">
            <FaKey size={20} />
            <h1 className="text-3xl font-semibold">Register</h1>
          </div>
          <p className="text-neutral-500 text-sm">Welcome to NextMatch</p>
        </div>
      </CardHeader>
      <CardBody>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onNext)}>
            <div className="space-y-4">
              {getStepContent(activeStep)}
              {errors.root?.serverError && (
                <p className="text-danger text-sm text-center">
                  {errors.root.serverError.message}
                </p>
              )}
              <div className="flex flex-row items-center gap-6">
                {activeStep !== 0 && (
                  <Button
                    onClick={onBack}
                    fullWidth
                    className="bg-gradient-to-r to-orange-200 from-red-800 hover:bg-gradient-to-r hover:to-orange-50 hover:from-red-600 hover:text-white"
                    variant="bordered"
                  >
                    Back
                  </Button>
                )}
                <Button
                  isLoading={isSubmitting}
                  isDisabled={!isValid}
                  fullWidth
                  className="bg-gradient-to-r from-orange-200 to-red-800 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-600 hover:text-white"
                  variant="bordered"
                  type="submit"
                >
                  {activeStep === stepSchema.length - 1 ? "Submit" : "Continue"}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  );
};

export default RegisterForm;

// function setError(fieldName: string, arg1: { message: string }) {
//   throw new Error("Function not implemented.");
// }
