import { Navigate, Outlet } from "react-router-dom";
import {getConnectedUser} from "../../data/storage";

function LoginRouteWrapper () {
  return getConnectedUser() ? <Navigate to="/matches" /> : <Outlet />;
}

export default LoginRouteWrapper;

