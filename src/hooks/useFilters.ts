import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect, useTransition, ChangeEvent } from "react";
import { FaMale, FaFemale } from "react-icons/fa";
import useFilterStore from "./useFilterStore";
import { Selection } from "@nextui-org/react";
import usePaginationStore from "./usePaginationStore";

export const useFilters = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [clientLoaded, setClientLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setClientLoaded(true);
  }, []);

  const { filters, setFilters } = useFilterStore();
  const { pageNumber, pageSize, setPage , totalCount} = usePaginationStore((state) => ({
    pageNumber: state.pagination.pageNumber,
    pageSize: state.pagination.pageSize,
    setPage: state.setPage,
    totalCount:state.pagination.totalCount
  }));

  const { ageRange, gender, orderBy, withPhoto } = filters;

  useEffect(() => {
    if (gender || ageRange || orderBy || withPhoto) {
      setPage(1);
    }
  }, [gender, ageRange, orderBy, withPhoto, setPage]);

  useEffect(() => {
    startTransition(() => {
      const searchParams = new URLSearchParams();

      if (gender) searchParams.set("gender", gender.join(","));
      if (ageRange) searchParams.set("ageRange", ageRange.toString());
      if (orderBy) searchParams.set("orderBy", orderBy);
      if (pageSize) searchParams.set("pageSize", pageSize.toString());
      if (pageNumber) searchParams.set("pageNumber", pageNumber.toString());
      searchParams.set("withPhoto", withPhoto.toString());

      router.replace(`${pathname}?${searchParams}`);
    });
  }, [
    ageRange,
    orderBy,
    gender,
    withPhoto,
    router,
    pathname,
    pageNumber,
    pageSize,
  ]);

  const orderByList = [
    { label: "Last Active", value: "updated" },
    { label: "Newest Members", value: "created" },
  ];

  const genderList = [
    { value: "male", icon: FaMale },
    { value: "female", icon: FaFemale },
  ];

  const handleAgeSelect = (value: number[]) => {
    setFilters("ageRange", value);
  };
  const handleOrderSelect = (value: Selection) => {
    if (value instanceof Set) {
      setFilters("orderBy", value.values().next().value);
    }
  };
  const handleGenderSelect = (value: string) => {
    if (gender.includes(value)) {
      setFilters(
        "gender",
        gender.filter((g) => g !== value)
      );
    } else {
      setFilters("gender", [...gender, value]);
    }
  };

  const handleWithPhotoToggle = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters("withPhoto", e.target.checked);
  };

  return {
    orderByList,
    genderList,
    selectAge: handleAgeSelect,
    selectOrder: handleOrderSelect,
    selectGender: handleGenderSelect,
    selectWithPhoto:handleWithPhotoToggle,
    totalCount,
    filters,
    clientLoaded,
    isPending,
  };
};
