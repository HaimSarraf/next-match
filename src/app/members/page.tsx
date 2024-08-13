import React from "react";
import { getMembers } from "../actions/memberActions";
import MembersCard from "./MembersCard";
import { fetchCurrentUserLikeIds } from "../actions/likeActions";

export default async function MembersPage() {
  const members = await getMembers();

  const likeIds = await fetchCurrentUserLikeIds();

  return (
    <div className="mt-10 grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
      {members &&
        members.map((member) => (
          <MembersCard member={member} key={member.id} likeIds={likeIds} />
        ))}
    </div>
  );
}
