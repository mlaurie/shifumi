import { useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { logout } from '../../shared/data/api'
import { getConnectedUser } from "../../shared/data/storage";

function Logout() {
  const navigate = useNavigate();
  const connectedUser = getConnectedUser()

  const handleLogout = useCallback(() => {
      logout()
      navigate('/login');
  }, [navigate])

  return connectedUser && (
    <div
      onClick={handleLogout}
      style={{ position : "absolute", right: "20px", top: "20px" }}
      className="hover:cursor-pointer hover:scale-110 hover:duration-150 bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 px-2 py-2 rounded-md text-lg tracking-wide">
        Logout {connectedUser?.username}
    </div>
  )
}

export default Logout;
