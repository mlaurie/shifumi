import { useCallback } from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { postTurn } from '../../data/api';

function MatchMoveItem({ move, img, matchId, turnId }){
  const [error, setError] = useState()
  const canClick = !img.includes("secret_move")

  /**
   * Onclick post move
   */
  const handleClick = useCallback( async () => {
    try {
      const turn = await postTurn(matchId, turnId, move)
    } catch (err) {
      setError(err)
    }
  }, [matchId, move, turnId])
  
  return (
    <button className="w-16" >
      <img
        data-move={move}
        onClick={canClick ? handleClick : undefined}
        className="hover:cursor-pointer hover:origin-center hover:scale-110 hover:duration-150 hover:rotate-12"
        src={img}
        alt={move}/>
      {move}
    </button>
  );

}

export default MatchMoveItem;
