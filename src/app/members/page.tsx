import React from "react";
import { getMembers } from "../actions/memberActions";
import MembersCard from "./MembersCard";
import { fetchCurrentUserLikeIds } from "../actions/likeActions";
import PaginationComponent from "@/components/PaginationComponent";
import { GetMemberParams } from "../types";
import EmptyState from "@/components/EmptyState";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: GetMemberParams;
}) {
  const { items: members, totalCount } = await getMembers(searchParams);
  const likeIds = await fetchCurrentUserLikeIds();

  return (
    <>
      {!members || members.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="mt-10 grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
            {members &&
              members.map((member) => (
                <MembersCard
                  member={member}
                  key={member.id}
                  likeIds={likeIds}
                />
              ))}
          </div>
          <PaginationComponent totalCount={totalCount} />
        </>
      )}
    </>
  );
}
