import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import Button from '../lib/ButtonMove';
import paper from '../../assets/images/paper.png';
import scissors from '../../assets/images/scissors.png';
import rock from '../../assets/images/rock.png';
import RevealCard from './RevealCard';
import { fetchMatch, fetchMatchEvents } from '../../data/api';
import Logout from "../Security/Logout";

function Match() {
  const { matchId } = useParams();
  const [match, setMatch] = useState()
  const [error, setError] = useState()
  const [turnId, setTurnId] = useState();
  const [player1Score, setPlayer1Score] = useState();
  const [player2Score, setPlayer2Score] = useState();

  useEffect(() => {
    async function loadMatch () {
      try {
        const data = await fetchMatch(matchId)
        setMatch(data)
      } catch (err) {
        setError(err)
      }
    }

    loadMatch()
  }, [matchId])

  useEffect(() => {
    const stream = fetchMatchEvents(matchId)

    return () => stream.close()
  }, [matchId])

  useEffect(() => {
    if (match && Array.isArray(match.turns)) {
      const lastTurnIndex = Math.max(match.turns.length - 1, 0)
      const lastTurnId = lastTurnIndex + 1
      const lastTurn = match.turns[lastTurnIndex]
      const isLastTurnFinished = lastTurn && lastTurn.user1 && lastTurn.user2
      const currentTurnId = isLastTurnFinished ? lastTurnId + 1 : lastTurnId

      setTurnId(currentTurnId)
    }
  }, [match])

  useEffect(() => {
    if (match && Array.isArray(match.turns)) {
      const score1 = match.turns.reduce((score, turn) => score + (turn?.winner === 'user1' ? 1 : 0), 0)
      const score2 = match.turns.reduce((score, turn) => score + (turn?.winner === 'user2' ? 1 : 0), 0)

      setPlayer1Score(score1)
      setPlayer2Score(score2)
    }
  }, [match])

  return (
    <>
    <Logout />
    <RevealCard />
    { match?.winner && (
      <div className="">
        <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Winner</h1>
        <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">{match.winner.username}</h1>
      </div>
    )}
      <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-md">
        <div className='space-y-8'>
          <div className='space-y-4'>
            <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Choose a move</h1>
            { turnId && (
              <h2 className="text-center text-xl font-semibold text-gray-600">Turn {turnId}</h2>
            )}
          </div>
          <div className="flex h-44 justify-center items-center">
            <div className="self-end">
              <Button matchId={matchId} turnId={turnId} move="paper" img={paper}/>
            </div>
            <div className="self-start">
              <Button matchId={matchId} turnId={turnId} move="scissors" img={scissors}/>
            </div>
            <div className="self-end">
              <Button matchId={matchId} turnId={turnId} move="rock" img={rock}/>
            </div>
          </div>
          <table className="m-auto border-2 border-slate-400">
            <thead>
                <tr className="bg-gradient-to-tr from-blue-600 to-indigo-600">
                  <th className="text-white px-8 border-2 border-slate-400">Player 1</th>
                  <th className="text-white px-8 border-2 border-slate-400">Player 2</th>
                </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-2 border-slate-400">{player1Score}</td>
                <td className="py-2 px-4 border-2 border-slate-400">{player2Score}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-md">
        <div className='space-y-12'>
          <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">History</h1>

          {Array.isArray(match?.turns) && match.turns.map((turn, index) => (
            <div style={{ marginTop: 0 }} key={index}>Turn {index + 1} => player 1 : {turn.user1} | player 2 : {turn.user2}</div>
          ))}
        </div>
      </div>
    </>
  );

}

export default Match;
