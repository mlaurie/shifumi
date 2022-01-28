import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import Button from '../lib/ButtonMove';
import paper from '../../images/paper.png';
import scissors from '../../images/scissors.png';
import rock from '../../images/rock.png';
import Score from './Score';
import RevealCard from './RevealCard';

function Match() {
  const { id } = useParams();
  const [isVisible, setIsVisible] = useState(true);
  const [turn, setTurn] = useState();

  useEffect(() => {
    fetch(`http://fauques.freeboxos.fr:3000/matches/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
    })
      .then((response) => response.json()
      .then((match) => {
        console.log(match.turns)
        match.turns[match.turns.length -1].winner && typeof match.turns[match.turns.length -1].winner !== "undefined" ? setTurn(match.turns.length + 1) : setTurn(match.turns.length);
        match.winner && typeof match.winner !== "undefined" && setIsVisible(false);
        typeof match.winner !== null && setIsVisible(false);
      })
      .catch((error) => console.log(error))
    )
  }, [])

  return (
    <>
    <RevealCard />
      <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-md">
        <div className='space-y-12'>
          <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Choose a move</h1>
          { isVisible &&
          <div className="flex h-44 justify-center items-center">
            <div className="self-end">
              <Button turn={turn} title="paper" img={paper}/>
            </div>
            <div className="self-start">
              <Button turn={turn} title="scissors" img={scissors}/>
            </div>
            <div className="self-end">
              <Button turn={turn} title="rock" img={rock}/>
            </div>
          </div>}
          <Score />
        </div>
      </div>
    </>
  );

}

export default Match;