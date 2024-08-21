"use client";

import PresenceDot from "@/components/PresenceDot";
import { calculateAge, transformImageUrl } from "@/lib/utils";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react";
import { Member } from "@prisma/client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  member: Member;
  navLinks: { name: string; href: string }[];
};

export default function MemberSidebar({ member, navLinks }: Props) {
  const pathname = usePathname();

  return (
    <Card className="w-full mt-10 items-center h-[80vh]">
      <Image
        height={200}
        width={200}
        src={transformImageUrl(member.image) || "/images/user.png"}
        alt="user-image"
        className="rounded-full mt-6 aspect-square object-cover"
      />
      <CardBody className="overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="flex">
            <div className="text-2xl">
              {member.name} | {calculateAge(member.dateOfBirth)}
            </div>
            <div>
              <PresenceDot member={member} />
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            {member.city} / {member.country}
          </div>
        </div>
        <Divider className="my-3" />
        <nav className="flex flex-col p-4 ml-4 text-2xl gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`block rounded-xl bg-yellow-50 text-center ${
                pathname === link.href
                  ? "text-orange-400"
                  : "hover:text-orange-100"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </CardBody>
      <CardFooter>
        <Button
          as={Link}
          href="/members"
          fullWidth
          className="bg-orange-300 hover:text-white hover:bg-orange-600"
        >
          Go Back
        </Button>
      </CardFooter>
    </Card>
  );
}
