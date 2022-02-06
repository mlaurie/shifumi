import { useCallback } from "react";
import { useState } from "react";
import { postTurn } from '../../shared/data/api';

function MatchMoveItem({ move, img, matchId, turnId, selected, hidden, disabled }) {
  const [error, setError] = useState()
  const canClick = !img.includes("secret_move") && !disabled

  /**
   * Onclick post move
   */
  const handleClick = useCallback( async () => {
    try {
      await postTurn(matchId, turnId, move)
    } catch (err) {
      setError(err)
    }
  }, [matchId, move, turnId])

  return (

    <button className={canClick ? "w-16" : " w-16 hover:cursor-default"} style={{ visibility: hidden ? 'hidden' : undefined }}>
      <img
        data-move={move}
        onClick={canClick ? handleClick : undefined}
        className={canClick ? "hover:cursor-pointer hover:origin-center hover:scale-110 hover:duration-150 hover:rotate-12" : "hover:cursor-default"}
        style={{ borderRadius: '50px', border: selected ? '3px solid yellow' : undefined }}
        src={img}
        alt={move}/>
      {move}
    </button>
  );

}

export default MatchMoveItem;
