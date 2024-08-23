import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";

export default function EmptyState() {
  return (
    <div className="flex justify-center items-center mt-20">
      <Card className="p-5 bg-yellow-50 animate-pulse">
        <CardHeader className="text-3xl text-warning shadow-lg rounded-xl font-bold">
          NO RESULTS FOR THIS FILTERS
        </CardHeader>
        <CardBody className="text-center">
          PLEASE SELECT DIFFERENT FILTERS
        </CardBody>
      </Card>
    </div>
  );
}
