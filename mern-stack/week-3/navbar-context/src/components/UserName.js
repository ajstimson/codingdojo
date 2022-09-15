import { createContext, useState } from "react";

export const UserContext = createContext();

const UserName = ({ children }) => {
  const [userName, setUserName] = useState("Millard Fillmore");

  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserName;

// useMemo, useCallback, useRef
