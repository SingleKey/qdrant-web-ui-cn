import React from "react";

export const ScrollableParentContext = React.createContext({
  scrollableParent: () => window,
});

export const useScrollableParent = () => {
  const context = React.useContext(ScrollableParentContext);
  if (context === undefined) {
    throw new Error(
      "useScrollableParent must be used within a ScrollableParentProvider",
    );
  }
  return context.scrollableParent;
};
