"use client";

import React, { useState } from "react";
import DeleteButton from "./DeleteButton";
import MemberImage from "./MemberImage";
import StarButton from "./StarButton";
import { Photo } from "@prisma/client";
import { useRouter } from "next/navigation";
import { deleteImage, setMainImage } from "@/app/actions/userActions";

type Props = {
  photos: Photo[] | null;
  editing?: boolean;
  mainImageUrl?: string | null;
};

function MemberPhotos({ photos, editing, mainImageUrl }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState({
    type: "",
    isLoading: false,
    id: "",
  });

  const onSetMain = async (photo: Photo) => {
    if (photo.url === mainImageUrl) return null;

    setLoading({ id: photo.id, type: "main", isLoading: true });

    await setMainImage(photo);

    router.refresh();

    setLoading({ isLoading: false, id: "", type: "" });
  };

  const onDelete = async (photo: Photo) => {
    if (photo.url === mainImageUrl) return null;

    setLoading({ id: photo.id, type: "delete", isLoading: true });

    await deleteImage(photo);

    router.refresh();

    setLoading({ isLoading: false, id: "", type: "" });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-5">
      {photos &&
        photos.map((photo) => (
          <div key={photo.id} className="relative">
            <MemberImage photo={photo} />
            {editing && (
              <>
                <div
                  className="absolute top-3 left-3 z-50"
                  onClick={() => onSetMain(photo)}
                >
                  <StarButton
                    loading={
                      loading.isLoading &&
                      loading.type === "main" &&
                      loading.id === photo.id
                    }
                    selected={photo.url === mainImageUrl}
                  />
                </div>
                <div
                  className="absolute top-3 left-44 z-50"
                  onClick={() => onDelete(photo)}
                >
                  <DeleteButton
                    loading={
                      loading.isLoading &&
                      loading.type === "delete" &&
                      loading.id === photo.id
                    }
                  />
                </div>
              </>
            )}
          </div>
        ))}
    </div>
  );
}

export default MemberPhotos;
