import { useCallback } from "react";
import { useState } from "react";
import { postTurn } from '../../data/api';

function MatchMoveItem({ move, img, matchId, turnId }){
  const [error, setError] = useState()

  const handleClick = useCallback( async () => {
    try {
      const turn = await postTurn(matchId, turnId, move)
    } catch (err) {
      setError(err)
    }
  }, [matchId, move, turnId])

  return (
    <button className="w-24" >
      <img
        data-move={move}
        onClick={handleClick}
        className="hover:cursor-pointer hover:origin-center hover:scale-110 hover:duration-150 hover:rotate-12"
        src={img}
        alt={move}/>
      {move}
    </button>
  );

}

export default MatchMoveItem;
