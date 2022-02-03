import { useCallback } from "react";
import { useNavigate } from 'react-router-dom'; 
import Loader from "../Style/Loader";

function MatchListItem ({user1, user2, id}) {
  const navigate = useNavigate();

  /**
   * Onclick redirect to the match
   */
  const handleClickMatch = useCallback(() => {
    navigate(`/match/${id}`);
  }, [navigate, id])

  return (
      <div
        onClick={handleClickMatch}
        className="my-4 w-full hover:cursor-pointer hover:scale-110 hover:duration-150 hover:rounded-xl hover:drop-shadow-2xl grid grid-cols-3">
        <div className={user1 ? "not-italic" : "italic font-light"}>{user1 ? user1.username : <Loader />}</div>
        <div className="bg-indigo-600 mx-6 text-white rounded-3xl"> VS </div>
        <div className={user2 ? "not-italic" : "italic font-light" }>{user2 ? user2.username : <Loader />}</div>
      </div>
  )

}

export default MatchListItem;