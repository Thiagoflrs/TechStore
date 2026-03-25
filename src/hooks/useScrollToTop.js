import { useEffect } from "react";

const useScrollToTop = () => {
  useEffect(() => {
    const myButton = document.getElementById("scrollToTopBtn");

    const handleScroll = () => {
      if (
        document.body.scrollTop > 200 ||
        document.documentElement.scrollTop > 200
      ) {
        myButton.style.display = "block";
      } else {
        myButton.style.display = "none";
      }
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.onscroll = handleScroll;

    myButton.onclick = scrollToTop;

    return () => {
      window.onscroll = null;
      myButton.onclick = null;
    };
  }, []); 
};

export default useScrollToTop;
