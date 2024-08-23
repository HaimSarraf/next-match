"use client";

import { useFilters } from "@/hooks/useFilters";
import {
  Button,
  Select,
  SelectItem,
  Slider,
  Spinner,
  Switch,
} from "@nextui-org/react";

function Filters() {
  const {
    filters,
    genderList,
    orderByList,
    selectAge,
    selectGender,
    selectOrder,
    selectWithPhoto,
    isPending,
    totalCount,
    clientLoaded,
  } = useFilters();

  return (
    <div className="shadow-md py-2">
      <div className="flex flex-row justify-around items-center">
        <div className="flex gap-2 items-center">
          <div className="text-warning font-semibold text-xl">
            Friend(s) :{" "}
            {isPending ? <Spinner size="sm" color="warning" /> : totalCount}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {genderList.map(({ icon: Icon, value }) => (
            <Button
              key={value}
              isIconOnly
              size="sm"
              color={filters.gender.includes(value) ? "warning" : "default"}
              onClick={() => selectGender(value)}
            >
              <Icon size={24} />
            </Button>
          ))}
        </div>
        <div className="flex flex-row items-center gap-2 w-1/4">
          <Slider
            label={clientLoaded && "Age Range"}
            color="warning"
            size="sm"
            minValue={15}
            maxValue={105}
            defaultValue={filters.ageRange}
            onChangeEnd={(value) => selectAge(value as number[])}
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm">With Photo</p>
          <Switch
            color="warning"
            defaultSelected
            size="sm"
            onChange={selectWithPhoto}
          />
        </div>
        <div className="w-1/4">
          <Select
            size="sm"
            fullWidth
            label="Order By"
            variant="bordered"
            color="warning"
            aria-label="Order By Selector"
            selectedKeys={new Set([filters.orderBy])}
            onSelectionChange={selectOrder}
          >
            {orderByList.map((item) => (
              <SelectItem key={item.value} value={item.value} color="warning">
                {item.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

export default Filters;
