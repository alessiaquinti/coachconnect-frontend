import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function usePageTitle(title) {
  const setPageTitle = useOutletContext();

  useEffect(() => {
    if (setPageTitle) setPageTitle(title);
  }, [title, setPageTitle]);
}
