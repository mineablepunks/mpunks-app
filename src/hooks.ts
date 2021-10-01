import { useEffect } from "react";
import { useLocation, useHistory } from "react-router";

export const HackilyRewriteHistory = ({ title }: { title: string }) => {
  const currentPath = useLocation().pathname;
  const history = useHistory();

  useEffect(() => {
    if (currentPath !== title) {
      console.log(title);
      history.replace(title);
    }
  }, [currentPath, history, title]);
};
