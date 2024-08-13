import Catigories from "@/components/Catigories/Catigories";
import Container from "@/components/Container/Container";
import Filters from "@/components/Filters/Filters";
import { Title } from "@/components/Title/Title";
import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

// import Image from "next/image";

export default function Home() {
  return (
    <>
      <Container style={{ height: "3000px" }}>
        <Title size="h2" className="mt-7 font-extrabold">
          Все пиццы
        </Title>

        <Catigories></Catigories>

        <div className={cn("flex gap-[60px] pb-14 mt-7")}>
          <div className="w-[250px]">
            <Filters></Filters>
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-16"> 
            <div>gbwws</div>
            <div>gbwws</div>
            <div>gbwws</div>
            </div>
            
            </div>
        </div>
      </Container>
    </>
  );
}
