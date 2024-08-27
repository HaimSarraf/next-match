"use client";

import { getUnreadMessagesCount } from "@/app/actions/messageActions";
import useMessageStore from "@/hooks/useMessageStore";
import { useNotificationChannel } from "@/hooks/useNotificationChannel";
import { usePresenceChannel } from "@/hooks/usePresenceChannel";
import { NextUIProvider } from "@nextui-org/react";
import { useCallback, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

interface Props {
  children: React.ReactNode;
  userId: string | null;
  profileComplete:boolean
}

function Providers({ children, userId , profileComplete }: Props) {
  const isUnreadCountSet = useRef(false);

  const { updateUnreadCount } = useMessageStore((state) => ({
    updateUnreadCount: state.updateUnreadCount,
  }));

  const setUnreadCount = useCallback(
    (amount: number) => {
      updateUnreadCount(amount);
    },
    [updateUnreadCount]
  );

  useEffect(() => {
    if (!isUnreadCountSet.current && userId) {
      getUnreadMessagesCount().then((count) => {
        setUnreadCount(count);
      });
      isUnreadCountSet.current = true;
    }
  }, [setUnreadCount, userId]);

  usePresenceChannel(userId, profileComplete);
  useNotificationChannel(userId, profileComplete);

  return (
    <NextUIProvider>
      <ToastContainer
        position="bottom-center"
        hideProgressBar
        className="z-50 text-center font-bold"
      />

      {children}
    </NextUIProvider>
  );
}

export default Providers;
