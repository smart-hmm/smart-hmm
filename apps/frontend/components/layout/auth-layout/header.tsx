"use client";

import { useLogout } from "@/services/react-query/mutations/use-logout";
import { UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowContainer,
  Popover,
  PopoverPosition,
  Rect,
} from "react-tiny-popover";

export default function Header() {
  const router = useRouter();
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const { mutateAsync: logout } = useLogout();

  return (
    <div className="w-screen h-[50px] bg-foreground fixed top-0 left-0 z-1 flex flex-row justify-end items-center box-border pr-28">
      <Popover
        isOpen={isPopoverOpen}
        positions={["top", "bottom", "left", "right"]}
        content={({
          position,
          childRect,
          popoverRect,
        }: {
          position: PopoverPosition;
          childRect: Rect;
          popoverRect: Rect;
        }) => (
          <ArrowContainer
            position={position}
            childRect={childRect}
            popoverRect={popoverRect}
            arrowColor={"var(--color-foreground)"}
            arrowSize={10}
            className="popover-arrow-container"
            arrowClassName="popover-arrow"
          >
            <div
              className="bg-foreground text-surface rounded-md px-6 py-3 box-border flex flex-col gap-2 items-center"
              onClick={() => {
                setPopoverOpen(!isPopoverOpen);
              }}
            >
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => {
                  router.push("/account/profile");
                }}
              >
                Profile
              </button>
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => {
                  router.push("/account/settings");
                }}
              >
                Settings
              </button>
              <button
                type="button"
                className="cursor-pointer"
                onClick={async () => {
                  await logout();
                  window.location.reload();
                }}
              >
                Logout
              </button>
            </div>
          </ArrowContainer>
        )}
      >
        <div
          onClick={() => setPopoverOpen(!isPopoverOpen)}
          className="rounded-full bg-surface w-[30px] aspect-square flex items-center justify-center cursor-pointer"
        >
          <UserRound color="#aaaaaa" size={24} />
        </div>
      </Popover>
    </div>
  );
}
