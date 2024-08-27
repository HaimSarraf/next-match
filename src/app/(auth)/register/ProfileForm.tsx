"use client";

import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { format, subYears } from "date-fns";
import { useFormContext } from "react-hook-form";

export default function ProfileForm() {
  const {
    formState: { errors },
    register,
    getValues,
    setValue,
  } = useFormContext();

  const genderList = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  return (
    <div className="space-y-4">
      <Select
        defaultSelectedKeys={getValues("gender")}
        label="Gender"
        aria-label="Select Gender"
        variant="bordered"
        {...register("gender")}
        isInvalid={!!errors.gender}
        errorMessage={errors.gender?.message as string}
        onChange={(e) => setValue("gender", e.target.value)}
      >
        {genderList.map((item) => (
          <SelectItem key={item.value} value={item.value} color="warning">
            {item.label}
          </SelectItem>
        ))}
      </Select>
      <Input
        defaultValue={getValues("dateOfBirth")}
        label="Date Of Birth"
        max={format(subYears(new Date(), 15), "yyyy-MM-dd")}
        type="date"
        variant="bordered"
        {...register("dateOfBirth")}
        isInvalid={!!errors.dateOfBirth}
        errorMessage={errors.dateOfBirth?.message as string}
      />
      <Textarea
        defaultValue={getValues("description")}
        label="Description"
        variant="bordered"
        {...register("description")}
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message as string}
      />
      <Input
        defaultValue={getValues("city")}
        label="City"
        variant="bordered"
        {...register("city")}
        isInvalid={!!errors.city}
        errorMessage={errors.city?.message as string}
      />
      <Input
        defaultValue={getValues("country")}
        label="Country"
        variant="bordered"
        {...register("country")}
        isInvalid={!!errors.country}
        errorMessage={errors.country?.message as string}
      />
    </div>
  );
}
