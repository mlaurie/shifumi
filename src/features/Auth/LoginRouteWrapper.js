import { Navigate, Outlet } from "react-router-dom";
import {getConnectedUser} from "../../shared/data/storage";

const LoginRouteWrapper = () => getConnectedUser()
  ? <Navigate to="/matches" />
  : <Outlet />;

export default LoginRouteWrapper;

