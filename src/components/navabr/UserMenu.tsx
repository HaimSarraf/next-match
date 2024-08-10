"use client";

import { SignOutUser } from "@/app/actions/authActions";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import { Session } from "next-auth";
import Link from "next/link";
import React from "react";

type Props = {
  user: Session["user"];
};

function UserMenu({ user }: Props) {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="default"
          name={user?.name || "user avatar"}
          size="sm"
          src={user?.image || "/images/user.png"}
        />
      </DropdownTrigger>
      <DropdownMenu variant="flat" aria-label="User Action Menu">
        <DropdownSection showDivider>
          <DropdownItem
            isReadOnly
            as="span"
            className="h-14 flex flex-row"
            aria-label="username"
          >
            <p className="flex flex-row gap-2 justify-items-center place-items-center">
              <h1>Signed In As {"  "}</h1>
              <h1 className="font-bold text-xl text-violet-500">
                {user?.name}
              </h1>
            </p>
          </DropdownItem>
        </DropdownSection>
        <DropdownItem as={Link} href="members/edit">
          Edit Profile
        </DropdownItem>
        <DropdownItem
          color="danger"
          onClick={async () => SignOutUser()}
         
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default UserMenu;
