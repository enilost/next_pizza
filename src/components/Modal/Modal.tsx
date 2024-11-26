"use client";

import { usePathname, useRouter, } from "next/navigation";
import { Dialog, DialogContent } from "../ui/dialog";
import Link from "next/link";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
// import { useNavigate } from "next/navigation";

export function Modal({ children ,className}: { children: React.ReactNode,className?:string }) {
  const Router = useRouter();
  const pathname = usePathname();
  //   const navigate = useNavigate();
  const back = () => {
    const previousUrl =document.referrer;// window.history.state//.url//.back();
    console.log("previousUrl", previousUrl);
    console.log("previousUrl", history);
    
    if ('scrollRestoration' in history && history.scrollRestoration !== 'manual') {
        const p = history.scrollRestoration
        history.scrollRestoration = 'manual';
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
    body.style.overflow = 'hidden';
      return () => {
          console.log("modal unmount");
          body.style.overflow = 'auto';
      }
  }, []);
  return (
    <div
    //   href={'#'} 
    //   scroll={false}
      className={cn("fixed top-0 bottom-0 left-0 right-0  z-55 bg-slate-400/80 flex items-center justify-center overflow-hidden",className)}
      onClick={() => {
        // back();
        Router.back()
      }}
    >
      <div
        className=" max-h-[77%] bg-white p-8 rounded-3xl overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto overflow-x-hidden scrl_glbl ">
          {children}
          {/* <button
            onClick={() => {
              // router.back({scroll: false});
            //   router.back();
            }}
          >
            Close modal
          </button> */}
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
