"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { Member } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Key, useTransition } from "react";
import MembersCard from "../members/MembersCard";
import LoadingComponents from "@/components/LoadingComponents";

type Props = {
  members: Member[];
  likeIds: string[];
};

function ListsTab({ likeIds, members }: Props) {
  const searchParams = useSearchParams();

  const router = useRouter();

  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const tabs = [
    { id: "source", label: "Members I have Liked" },
    { id: "target", label: "Members Like Me" },
    { id: "mutual", label: "Mutual Likes" },
  ];

  function handleTabChange(key: Key) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      params.set("type", key.toString());

      router.replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex w-full flex-col mt-10 gap-5">
      <Tabs
        aria-label="like tabs"
        items={tabs}
        color="secondary"
        onSelectionChange={(key) => handleTabChange(key)}
      >
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {isPending ? (
              <div className="justify-center items-center px-20">
                <LoadingComponents label="Please Wait"/>
              </div>
            ) : (
              <>
                {members.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                    {members.map((member) => (
                      <MembersCard
                        key={member.id}
                        member={member}
                        likeIds={likeIds}
                      />
                    ))}
                  </div>
                ) : (
                  <div>No Members for this filter</div>
                )}
              </>
            )}
          </Tab>
        )}
      </Tabs>
    </div>
  );
}

export default ListsTab;
