import { useCallback } from "react";
import { useNavigate } from 'react-router-dom';

function BackButton () {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate('/matches');
  }, [navigate])

  return (
    <div
    onClick={handleClick}
    style={{ position : "absolute", left: "20px", top: "20px" }}
    className="hover:cursor-pointer hover:scale-110 hover:duration-150 bg-indigo-600 text-indigo-100 px-2 py-2 rounded-2xl text-md tracking-wide">
    ← Go Back
    </div>
  );
}

export default BackButton;
