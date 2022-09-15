import { useContext } from "react";
import { UserContext } from "./UserName";

const Navbar = () => {
  const user = useContext(UserContext);
  return (
    <nav>
      <h1>Hi {user.userName}</h1>
    </nav>
  );
};

export default Navbar;
