"use client";

import { SignOutUser } from "@/app/actions/authActions";
import { transformImageUrl } from "@/lib/utils";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import Link from "next/link";
import React from "react";

type Props = {
  userInfo: { name: string | null; image: string | null } | null;
};

function UserMenu({ userInfo }: Props) {
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="default"
          name={userInfo?.name || "user avatar"}
          size="sm"
          src={transformImageUrl(userInfo?.image) || "/images/user.png"}
        />
      </DropdownTrigger>
      <DropdownMenu
        variant="flat"
        aria-label="User Action Menu"
        className="bg-yellow-100/65"
      >
        <DropdownSection showDivider>
          <DropdownItem
            isReadOnly
            as="span"
            className="h-14 flex flex-row "
            aria-label="username"
          >
            <div className="flex flex-row gap-2 justify-items-center place-items-center">
              <h1 className="text-medium">Signed In As {"  "}</h1>
              <h1 className="font-bold text-xl text-orange-500">
                {userInfo?.name}
              </h1>
            </div>
          </DropdownItem>
        </DropdownSection>
        <DropdownItem as={Link} href="members/edit">
          Edit Profile
        </DropdownItem>
        <DropdownItem color="danger" onClick={async () => SignOutUser()}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default UserMenu;
