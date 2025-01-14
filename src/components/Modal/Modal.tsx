"use client";

import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent } from "../ui/dialog";
import Link from "next/link";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
// import { useNavigate } from "next/navigation";

export function Modal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const Router = useRouter();
  const pathname = usePathname();
  //   const navigate = useNavigate();
  const back = () => {
    const previousUrl = document.referrer; // window.history.state//.url//.back();
    console.log("previousUrl", previousUrl);
    console.log("previousUrl", history);

    if (
      "scrollRestoration" in history &&
      history.scrollRestoration !== "manual"
    ) {
      const p = history.scrollRestoration;
      history.scrollRestoration = "manual";
      Router.back();
      // history.scrollRestoration = p;
    }
  };
  useEffect(() => {
    console.log("modal mount", window.scrollY);
    // console.log("modal router", router);
    // console.log("modal pathname", pathname);
    // console.log("modal window.location.pathname", window.location);
    const body = document.body;
    body.style.overflow = "hidden";
    return () => {
      console.log("modal unmount");
      body.style.overflow = "auto";
    };
  }, []);
  return (
    <div
      className={cn(
        "fixed top-0 bottom-0 left-0 right-0  z-55 bg-slate-400/80 flex items-center justify-center overflow-hidden",
        className
      )}
      onClick={() => {
        Router.back();
      }}
    >
      <div
        className=" max-h-[77%] bg-white p-8 rounded-3xl overflow-hidden flex relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            Router.back();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            // stroke-width="2"
            // stroke-linecap="round"
            // stroke-linejoin="round"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x h-4 w-4"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
          <span className="sr-only">Close</span>
        </button>

        <div className="overflow-y-auto overflow-x-hidden scrl_glbl ">
          {children}
        </div>
      </div>
    </div>
    // <Dialog open={Boolean(children)}>
    //     <DialogContent>
    //         {children}
    //         </DialogContent>
    // </Dialog>
  );
}
