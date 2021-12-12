import MyContext from "src/types/MyContext";
import { AuthChecker } from "type-graphql";

const checkAuth: AuthChecker<MyContext> = ({ context }) => {
  return !!context.user;
};

export default checkAuth;
