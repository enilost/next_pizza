"use client";

import { useEffect, useLayoutEffect } from "react";

const ScrollTopPage = () => {
  useLayoutEffect(() => {
    // console.log("ScrollTopPage", window);
    // window.scrollTo(0, 0);
    // window.scrollTo({ top: 0, behavior: "auto" });
    if (typeof window !== "undefined") {
    }
    // window.addEventListener("load", function () {
    //   window.scrollTo(0, 0);
    // });
    // document.addEventListener("DOMContentLoaded", function () {
    //   document.body.scrollTo(0, 0);
    // });
  });
  //   window.addEventListener('load', function() {
  //       window.scrollTo(0, 0);
  //     });
  //     document.addEventListener('DOMContentLoaded', function() {
  //       document.body.scrollTo(0, 0);
  //     });
  // window.scrollTo(0, 0);

  return (
    <script>
      {`
    window.scrollTo(0, 0);
  `}
    </script>
  );
  return null;
};

export default ScrollTopPage;
