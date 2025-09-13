"use client";
import { FunctionComponent, useEffect, useState } from "react";
import apiClient from "../../../services/apiClient";
import Container from "../Container/Container";
import { cn } from "@/lib/utils";
import { StoryT } from "../../../services/stories";
import { Loader2, X } from "lucide-react";
import ReactStories from "react-insta-stories";
interface StoriesProps {}

const Stories: FunctionComponent<StoriesProps> = () => {
  const [stories, setStories] = useState<StoryT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    // setLoading(true);
    apiClient
      .getStories()
      .then((data) => {
        setStories(data.slice(0, 6));
      })
      .catch((error) => {
        console.error("components/Stories/Stories.tsx", error);
      })
      .finally(() => {
        setLoading(false);
        
      });
  }, []);


  const openStory = (index: number) => {
    setSelectedStoryIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeStory = () => {
    setSelectedStoryIndex(null);
    document.body.style.overflow = "auto";
  };
  // if (selectedStoryIndex === null && typeof document !== "undefined") {
  //   document.body.style.overflow = "auto";
  // }
  return (
    <>
      <Container
        className={cn("flex items-center justify-between my-3 px-0 gap-1")}
      >
        {loading &&
          Array.from({ length: 6 }).map((element, i) => {
            return (
              <div
                key={i}
                className=" flex-shrink flex-grow-0 basis-[175px] animate-pulse bg-gray-200 rounded-md overflow-hidden"
              >
                <div className="pt-[125.71%]"></div>
              </div>
            );
          })}

        {stories.map((story, index) => {
          return (
            <div
              className=" flex-shrink flex-grow-0 basis-[175px]  rounded-md relative overflow-hidden"
              key={story.id}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).querySelector(
                  "img"
                )!.style.transform = "scale(1.1)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).querySelector(
                  "img"
                )!.style.transform = "scale(1)";
              }}
            >
              <div className="pt-[125.71%]"></div>

              <img
                className={cn(
                  "absolute top-0 left-0 right-0 bottom-0 object-cover object-bottom cursor-pointer duration-300"
                )}
                src={story.imgUrl}
                alt={story.id.toString()}
                onClick={() => openStory(index)}
              />
            </div>
          );
        })}
      </Container>
      {/*  */}
      {selectedStoryIndex !== null && (
        <div
        id="story-modal-absolute"
          className={cn(
            "fixed  top-0 left-0 right-0 bottom-0  bg-black/80 flex items-center justify-center z-30 cursor-pointer"
          )}
          onClick={(e) => {
            e.stopPropagation();
            closeStory();
          }}
        >
          <div
            className={cn("relative", "basis-[360px] flex-grow-0 flex-shrink ")}
          >
            <X
              className="absolute -top-14 -right-1 w-8 h-8 text-white/55 z-[99999] "
              onClick={() => {
                closeStory();
              }}
            ></X>

            <div
              className={cn("")}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {/* bg-slate-400/80 */}
              <ReactStories
                width={"100%"}
                height={"560px"}
                onAllStoriesEnd={() => {
                  // closeStory();
                }}
                defaultInterval={3456}
                loader={
                  <Loader2 className="w-4 h-4 animate-spin ml-2 text-white" />
                }
                stories={stories[selectedStoryIndex].items.map((item) => ({
                  url: item.imgUrl,
                }))}
                // onStoryStart={() => {
                //   console.log("onStoryStart");
                  
                // }}
                storyContainerStyles={{'backgroundColor': 'rgb(148 163 184 / 0.8)'}}
              ></ReactStories>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;
