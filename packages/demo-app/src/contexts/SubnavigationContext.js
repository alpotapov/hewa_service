import React, { createContext, useContext, useState } from 'react';

const SubnavigationContext = createContext();

export const useSubnavigation = () => useContext(SubnavigationContext);

// eslint-disable-next-line react/prop-types
export function SubnavigationProvider({ children }) {
  const [subnavigation, setSubnavigation] = useState([]);

  const value = React.useMemo(
    () => ({ subnavigation, setSubnavigation }),
    [subnavigation, setSubnavigation]
  );

  return <SubnavigationContext.Provider value={value}>{children}</SubnavigationContext.Provider>;
}
