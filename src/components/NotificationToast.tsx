import { MessageDto } from "@/app/types";
import { transformImageUrl } from "@/lib/utils";
import { Image } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

type Props = {
  image?: string | null;
  href: string;
  title: string;
  subtitle?: string;
};

export default function NotificationToast({
  href,
  subtitle,
  title,
  image,
}: Props) {
  return (
    <Link href={href} className="flex items-center">
      <div className="mr-2">
        <Image
          src={transformImageUrl(image) || "/images/user.png"}
          height={50}
          width={50}
          alt="Sender Image"
        />
      </div>
      <div className="flex flex-col flex-grow justify-center">
        <div className="font-semibold">{title}</div>
        <div className="text-sm">{subtitle || "CLICK TO VIEW"}</div>
      </div>
    </Link>
  );
}

export const newMessageToast = (message: MessageDto) => {
  toast(
    <NotificationToast
    image={message.senderImage}
    href={`/members/${message.senderId}/chat`}
      title={`${message.senderName} has sent you a new message`}
    />
  );
};

export const newLikeToast = (
  name: string,
  image: string | null,
  userId: string
) => {
  toast(
    <NotificationToast
      image={image}
      href={`/members/${userId}`}
      title={`You've Been Liked By ${(
        <p className="text-green-500">{name.toUpperCase()}</p>
      )}`}
      subtitle="CLICK HERE TO VIEW THEIR PROFILE"
    />
  );
};
