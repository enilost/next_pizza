import Catigories from "@/components/Catigories/Catigories";
import Container from "@/components/Container/Container";
import Filters from "@/components/Filters/Filters";
import ProguctCardGroup from "@/components/ProguctCardGroup/ProguctCardGroup";
import { Title } from "@/components/Title/Title";
import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

// import Image from "next/image";
const items = [
  {
    id: 0,
    name: "пыцца",
    description: "ципленогк цацарэлла пырмизана олифка",
    price: 200,
    imageURL:
      "https://media.dodostatic.net/image/r:292x292/11EE7D610D2925109AB2E1C92CC5383C.jpg",
  },
  {
    id: 1,
    name: "пыцца2",
    description: "ципленогк цацарэлла пырмизана олифка",
    price: 222,
    imageURL:
      "https://media.dodostatic.net/image/r:292x292/11EE7D610D2925109AB2E1C92CC5383C.jpg",
  },
  {
    id: 2,
    name: "пыцца3",
    description: "ципленогк цацарэлла пырмизана олифка",
    price: 232,
    imageURL:
      "https://media.dodostatic.net/image/r:292x292/11EE7D610D2925109AB2E1C92CC5383C.jpg",
  },
  {
    id: 3,
    name: "пыцца4",
    description: "ципленогк цацарэлла пырмизана олифка",
    price: 234,
    imageURL:
      "https://media.dodostatic.net/image/r:292x292/11EE7D610D2925109AB2E1C92CC5383C.jpg",
  },
];

const cats =[
  {
    categoryID: 0,
    name: "Пиццы",
    items:items
  },
  {
    categoryID: 1,
    name: "Комбо",
    items:items
  },
  {
    categoryID: 2,
    name: "Дессерты",
    items:items
  },
  {
    categoryID: 3,
    name: "Кофе",
    items:items
  },
  {
    categoryID: 4,
    name: "Коктейли",
    items:items
  },
  {
    categoryID: 5,
    name: "Пиццыs",
    items:items
  },
  {
    categoryID: 6,
    name: "Пиццыы",
    items:items
  },
  {
    categoryID: 7,
    name: "Напитки",
    items:items
  }
];


let arr=[
  {id:1},
  {id:2},
  {id:3},
  {id:4},
  {id:5}
]

export default async function Home() {

  return (
    <>
      <Container 
      // style={{ height: "3000px" }}
      >
        <Title size="h2" className="mt-7 font-extrabold">
          Все пиццы
        </Title>

        <Catigories 
        categories={cats} 
        // activeIndex={0}
        ></Catigories>

        <div className={cn("flex gap-[100px] pb-14 mt-7")}>
          <div className="w-[250px]">
            <Filters></Filters>
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {/* {[...cats].m} */}
              {cats.map((el, idx) => {
                return (
                  <div key={idx}>
                    <ProguctCardGroup
                      items={el.items} 
                      title={el.name}
                      categoryId={el.categoryID}
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
