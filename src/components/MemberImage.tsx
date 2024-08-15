"use client";

import { Image } from "@nextui-org/react";
import { Photo } from "@prisma/client";
import { CldImage } from "next-cloudinary";
import React from "react";

type Props = {
  photo: Photo | null;
};

function MemberImage({ photo }: Props) {
  return (
    <div>
      {photo?.publicId ? (
        <CldImage
          alt="image of member"
          src={photo.publicId}
          width={220}
          height={220}
          crop="fill"
          gravity="faces"
          className="rounded-2xl"
          priority
        />
      ) : (
        <Image
          width={220}
          height={220}
          src={photo?.url || "/images/user.png"}
          alt="image of user"
        />
      )}
    </div>
  );
}

export default MemberImage;
