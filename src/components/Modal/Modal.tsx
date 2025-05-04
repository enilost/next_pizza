"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

export function Modal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const Router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const body = document.body;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = "auto";
    };
  }, []);

  if(!mounted) return null;
  const modalTemplate = (
    <div
      className={cn(
        "fixed top-0 bottom-0 left-0 right-0  z-55 bg-slate-400/80 flex items-center justify-center overflow-hidden",
        className
      )}
      onClick={() => {
        Router.back();
      }}
      id="modal_overlay"
    >
      <div
        className=" max-h-[77%] bg-white p-8 rounded-3xl overflow-hidden flex relative"
        onClick={(e) => e.stopPropagation()}
        id="modal_wrapper"
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

        <div
          className="overflow-y-auto overflow-x-hidden scrl_glbl "
          id="modal_inner"
        >
          {children}
        </div>
      </div>
    </div>
  );
  const modalContainer = document.getElementById("modal_container");
  if (modalContainer) {
    const layoutModalContainer = document.getElementById("layout_modal_container");
    if (layoutModalContainer) layoutModalContainer.remove();
    return createPortal(modalTemplate, modalContainer);
  }
  return (
    modalTemplate
  );
}
