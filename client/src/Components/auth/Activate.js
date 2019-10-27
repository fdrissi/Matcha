import { useEffect } from "react";
import { useUserStore } from "../../Context/appStore";
import { activation } from "../../actions/userAction";

const Activate = props => {
  const [, dispatch] = useUserStore();
  let username = props.match.params.username;
  let token = props.match.params.token;
  useEffect(() => {
    activation(username, token, dispatch);
  }, []);
  return 0;
};
export default Activate;
