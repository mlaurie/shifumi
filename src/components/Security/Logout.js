import { useNavigate } from 'react-router-dom';

function Logout() {

    const navigate = useNavigate();

    function handleClickLogout() {
        localStorage.removeItem("token");
        navigate('/login');
    }

    return (
    <div 
        onClick={(e) => handleClickLogout()} 
        style={{
            position : "absolute",
            right: "0",
            marginTop : "20px",
            marginRight : "20px"
        }}
        className="hover:cursor-pointer hover:scale-110 hover:duration-150 bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 px-2 py-2 rounded-md text-lg tracking-wide">
        Logout
    </div>
    )

}

export default Logout;