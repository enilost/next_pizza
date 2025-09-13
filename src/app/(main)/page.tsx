import Catigories from "@/components/Catigories/Catigories";
import Container from "@/components/Container/Container";
import Filters from "@/components/Filters/Filters";
import ProguctCardGroup from "@/components/ProguctCardGroup/ProguctCardGroup";
import { Title } from "@/components/Title/Title";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

import prisma from "@/../../prisma/prisma-client";
import { CreatePrismaFilter, I_FILTER_PARAMS } from "@/constants/constants";
import { Prisma } from "@prisma/client";
import Stories from "@/components/Stories/Stories";

export type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: {
    products: {
      include: {
        items: true;
        ingredients: true;
      };
    };
  };
}>;
export default async function Home({
  searchParams,
}: {
  searchParams: {
    [key in I_FILTER_PARAMS[keyof I_FILTER_PARAMS]]?: string;
  };
}) {
  // console.log("Home", process.env.NEXT_PUBLIC_API_URL);

  const filter = new CreatePrismaFilter(searchParams).prismaHomePageFilter;
  // console.log("filter", JSON.stringify(filter, null, 2));
  let categories: CategoryWithProducts[] = [];
  try {
    categories = (await prisma.category.findMany(filter)).sort(
      (a, b) => a.id - b.id
    ) as CategoryWithProducts[];
    // console.log("categories", JSON.stringify(categories, null, 2));
  } catch (err) {
    console.log("(main)/page.tsx error", err);
    categories = [];
  }

  return (
    <>
      <Container
      >
        <Stories></Stories>
        <Title size="h2" className="mt-5 font-extrabold">
          Все пиццы
        </Title>

        <Catigories
          categories={categories}
          // activeIndex={0}
        ></Catigories>

        <div className={cn("flex gap-[100px] pb-14 mt-7")}>
          <div className="w-[250px]">
            <Suspense>
              <Filters></Filters>
            </Suspense>
          </div>
          <div className="flex-1">
            <div className="flex flex-col ">

              {categories.map((el, idx) => {
                return (
                  <div key={el.id} className="-mb-[3px]">
                    <ProguctCardGroup
                      items={el.products}
                      title={el.name}
                      categoryId={el.id}
                    ></ProguctCardGroup>
                  </div>
                );
              })}

              <hr />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
