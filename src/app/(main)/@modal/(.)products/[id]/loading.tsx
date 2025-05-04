"use client";
import Container from "@/components/Container/Container";
import { Modal } from "@/components/Modal/Modal";
import { Loader, Loader2 } from "lucide-react";
import { FunctionComponent, useEffect } from "react";

interface LoadProps {
  params: any;
}

const Load: FunctionComponent<LoadProps> = ({ params }) => {
  useEffect(() => {
    // console.log("Loading mount");
    const body = document.body;
    body.style.overflow = "hidden";
    return () => {
      // console.log("Loading unmount");
      body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0  z-55 bg-slate-400/80 flex items-center justify-center">
      <Container className={"flex flex-col my-20 "}>
        <p className={"text-2xl font-bold text-white text-center"}>
          Загрузка <Loader2 className="text-white inline-block" />
        </p>
      </Container>
    </div>
  );
};

export default Load;
