import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import RevealCard from './RevealCard';
import { fetchMatch, fetchMatchEvents } from '../../data/api';
import Logout from "../Security/Logout";
import MatchScore from "./MatchScore"
import MatchHistory from './MatchHistory';
import MatchMoves from './MatchMoves';

function Match() {
  const { matchId } = useParams();
  const [match, setMatch] = useState()
  const [error, setError] = useState()
  const [turnId, setTurnId] = useState();
  const [player1Score, setPlayer1Score] = useState();
  const [player2Score, setPlayer2Score] = useState();
  const [usernamePlayer1, setUsernamePlayer1] = useState();
  const [usernamePlayer2, setUsernamePlayer2] = useState();

  /**
   * Load match data when mounting the component
   */
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

  /**
   * Subscribe to match notifications when mounting the component
   * Close subscription when component is unmounted
   */
  useEffect(() => {
    const stream = fetchMatchEvents(matchId)

    return () => stream.close()
  }, [matchId])

  /**
   * Calculate current turn ID when match data is retrieved
   */
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
      const usernamePlayer1 = match.user1.username
      const usernamePlayer2 = match.user2.username

      setUsernamePlayer1(usernamePlayer1)
      setUsernamePlayer2(usernamePlayer2)
    }
  }, [match])

  /**
   * Calculate scores when match data is retrieved
   */
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
    <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-6xl">
      <div className='space-y-6'>
        <div className='space-y-4'>
          { turnId && turnId < 4 && (
          <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Choose a move</h1>
          )}
          { turnId && turnId < 4 && (
            <h2 className="text-center text-2xl font-semibold text-gray-600">Turn {turnId}</h2>
          )}
        </div>
        { turnId && turnId < 4 && (
          <div className="grid grid-cols-3">
            <div>
              <h2 className='mb-4 text-xl'>{usernamePlayer1}</h2>
              <MatchMoves turnId={turnId} matchId={matchId}/>
            </div>
            <div>
              oo
            </div>
            <div>
            <h2 className='mb-4 text-xl'>{usernamePlayer2}</h2>
              <MatchMoves turnId={turnId} matchId={matchId}/>
            </div>
          </div>
        )}
        <h2 className="text-center my-8 text-xl font-semibold text-gray-600">Score</h2>
        <MatchScore usernamePlayer1={usernamePlayer1} usernamePlayer2={usernamePlayer2} player1Score={player1Score} player2Score={player2Score}/>
      </div>
      <h2 className="text-center my-8 text-xl font-semibold text-gray-600">History</h2>
      <div className='space-y-4'>
        {Array.isArray(match?.turns) && match.turns.map((turn, index) => (
          <MatchHistory usernamePlayer1={usernamePlayer1} usernamePlayer2={usernamePlayer2} key={index} index={index} turnUser1={turn.user1} turnUser2={turn.user2} />
        ))}
      </div>
    </div>
    </>
  );
}

export default Match;
