import { useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { logout } from '../../data/api'

function Logout() {
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        logout()
        navigate('/login');
    }, [navigate])

    return (
        <>
        { localStorage.getItem("token") && (
          <div
            onClick={handleLogout}
            style={{
                position : "absolute",
                right: "0",
                marginTop : "20px",
                marginRight : "20px"
            }}
            className="hover:cursor-pointer hover:scale-110 hover:duration-150 bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 px-2 py-2 rounded-md text-lg tracking-wide">
              Logout {localStorage.getItem("username")}
          </div>
        )}
    </>
    )
}

export default Logout;
