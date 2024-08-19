"use client";
import { useRouter } from "next/navigation";
import {  useCallback, useEffect, useRef, useState  } from "react";
import { useHash } from "react-use";

interface useSetAncorProps {
  // intersection: IntersectionObserverEntry | null;
  // ancorName: string;
  // ref:{current:any}
}
type useSetAncor = (args: useSetAncorProps) => {};
// : FunctionComponent<useSetAncorProps>
function useSetAncor(
  // { intersection, ancorName,ref }: useSetAncorProps
): [string,Function] {
  // const [ancor, setAncor] = useHash();
  // const refIntersection = useRef<IntersectionObserverEntry>(null);
  // // @ts-ignore
  // refIntersection.current = intersection;
  // useEffect(() => {
  //   if (intersection && intersection.isIntersecting && typeof window !=='undefined') {
  //     console.log("useEffect useSetAncor");
  //     const oldVal = intersection && intersection.isIntersecting;
  //     const delay = setTimeout(() => {
  //       let newVal =
  //         refIntersection.current && refIntersection.current.isIntersecting;
  //       console.log(newVal, oldVal, ancorName,ref.current);
  //       if (newVal && oldVal) {
  //         let oldScrollPosition = window.scrollY;

  //         setAncor(ancorName);

  //         window.scrollTo(0, oldScrollPosition);
  //       }
  //     }, 0);
  //     return () => {
  //       if (delay) {
  //         console.log("чистим старый делей ", ancorName);
  //         setAncor('');
  //         clearTimeout(delay);
  //       }
  //     };
  //   }
  // }, [intersection, intersection?.isIntersecting]);

  // return {};
  const firstRender = useRef(true)
  const [getHash, setHash] = useState(() => window.location.hash);
  const router = useRouter()
  const hashChangeHandler = useCallback(() => {
    setHash(window.location.hash);
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.addEventListener("hashchange", hashChangeHandler);
    return () => {
      window.removeEventListener("hashchange", hashChangeHandler);
    };
  }, []);

  const updateHash = useCallback(
    (newHash) => {

      console.log('document ',document.title);
      console.log('window.location ',window.location);
      
      if(newHash == '') {
        console.log("newHash == ''");
        const cleanedUrl = window.location.href.split('#')[0];
        router.replace(cleanedUrl,{scroll:false})
        // window.history.replaceState(null, '', cleanedUrl);
        // const title = document.title +''
        // window.history.replaceState(null, title, cleanedUrl) 
        // document.title = title
        // history.replaceState(null, '', ' ');
      }
      if (newHash !== getHash) {
        // window.location.hash = newHash;
        const cleanedUrl = window.location.href.split('#')[0] + `#${newHash}`;
        router.replace(cleanedUrl,{scroll:false})
      }
    },
    [getHash]
  );

  return [getHash, updateHash];
// };
}

export default useSetAncor;
