import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import Button from '../lib/ButtonMove';
import paper from '../../assets/images/paper.png';
import scissors from '../../assets/images/scissors.png';
import rock from '../../assets/images/rock.png';
import Score from './Score';
import RevealCard from './RevealCard';
import { fetchMatch } from '../../data/api';

function Match() {
  const { id } = useParams();
  const [isScoreVisible, setIsScoreVisible] = useState(false);
  const [isMoveVisible, setIsMoveVisible] = useState(false);
  const [error, setError] = useState()
  const [turn, setTurn] = useState();

  useEffect(() => {
    async function loadMatch () {
      try {
        const match = await fetchMatch(id)
        match.turns.length > 0 && setIsScoreVisible(true)
        typeof (match.winner) === "undefined" && setIsMoveVisible(true)
        //console.log(match.turns)
        //console.log(match.turns[match.turns.length -1])
        //console.log(match.turns[match.turns.length -1].winner)
        //match.turns[match.turns.length -1] && typeof match.turns[match.turns.length -1].winner !== "undefined" ? setTurn(match.turns.length + 1) : setTurn(match.turns.length);
      } catch (err) {
        setError(err)
      }
    }

    loadMatch()
  }, [id])

  return (
    <>
    <RevealCard />
      <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-md">
        <div className='space-y-12'>
          <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Choose a move</h1>
          { isMoveVisible &&
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
          { isScoreVisible && <Score /> }
        </div>
      </div>
    </>
  );

}

export default Match;
