import { Navigate, Outlet } from "react-router-dom";
import {getConnectedUser} from "../../shared/data/storage";

function PrivateRouteWrapper () {
  return getConnectedUser() ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRouteWrapper;
