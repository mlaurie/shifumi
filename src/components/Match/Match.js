import { useParams } from 'react-router-dom';
import {useState, useEffect, useCallback} from "react";

import { fetchMatch, fetchMatchEvents } from '../../data/api';
import Logout from "../Security/Logout";
import MatchScore from "./MatchScore"
import MatchHistory from './MatchHistory';
import MatchMoves from './MatchMoves';
import Loader from "../Style/Loader";
import { getConnectedUser } from '../../data/storage';
import BackButton from "../Style/BackButton"; 
import firework from '../../assets/images/firework.png';

const MatchEventTypes = {
  Player1Join: "PLAYER1_JOIN",
  Player2Join: "PLAYER2_JOIN",
  Player1Moved: "PLAYER1_MOVED",
  Player2Moved: "PLAYER2_MOVED",
  NewTurn: "NEW_TURN",
  TurnEnded: "TURN_ENDED",
  MatchEnded: "MATCH_ENDED",
}

const MATCH_MAXIMUM_TURNS = 3

/**
 * Match page that display current match state
 *
 * Match state is built from GET match response with multiple useEffects
 *
 * If match is not finished (no winner yet),
 * it subscribes to notifications system to refresh its state in real time when possible
 *    => impossible to calculate state from PLAYER1_MOVED
 *    => impossible to calculate state from PLAYER2_MOVED
 *    => impossible to calculate state from TURN_ENDED
 * so for these 3 events we need re-fetch the entire match
 *
 * @returns {JSX.Element}
 * @constructor
 */
function Match() {
  let eventsStream
  const { matchId } = useParams();
  const [match, setMatch] = useState()
  const [error, setError] = useState()
  const [turnId, setTurnId] = useState(1);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [usernamePlayer1, setUsernamePlayer1] = useState('');
  const [usernamePlayer2, setUsernamePlayer2] = useState('');
  const [matchWinner, setMatchWinner] = useState('');
  const connectedUser = getConnectedUser()

  async function loadMatch() {
    try {
      const data = await fetchMatch(matchId)
      setMatch(data)
    } catch (err) {
      setError(err)
    }
  }

  /**
   * Callback when receiving Player1Join event
   * @param {string} user
   */
  const onPlayer1JoinEvent = ({ user }) => {
    setUsernamePlayer1(user)
  }

  /**
   * Callback when receiving Player2Join event
   * @param {string} user
   */
  const onPlayer2JoinEvent = ({ user }) => {
    setUsernamePlayer2(user)
  }

  /**
   * Callback when receiving Player1Moved event
   *
   * This event gives us no exploitable information about the move,
   * so we need to fetch the entire match to recalculate the corresponding state from useEffects
   * @param {number} turn
   * @returns {Promise<void>}
   */
  const onPlayer1MovedEvent = async ({ turn }) => {
    await loadMatch()
  }

  /**
   * Callback when receiving Player2Moved event
   *
   * This event gives us no exploitable information about the move,
   * so we need to fetch the entire match to recalculate the corresponding state from useEffects
   * @param {number} turn
   * @returns {Promise<void>}
   */
  const onPlayer2MovedEvent = async ({ turn }) => {
    await loadMatch()
  }

  /**
   * Callback when receiving NewTurn event
   * @param {number} turnId
   */
  const onNewTurnEvent = ({ turnId }) => {
    setTurnId(turnId)
  }

  /**
   * Callback when receiving TurnEnded event
   *
   * This event gives us no exploitable information about the move,
   * so we need to fetch the entire match to recalculate the corresponding state from useEffects
   * @param {number} newTurnId
   * @param {string} winner
   */
  const onTurnEndedEvent = async ({ newTurnId, winner }) => {
    await loadMatch()
  }

  /**
   * Callback when receiving MatchEnded event
   * @param {string} winner
   */
  const onMatchEndedEvent = ({ winner }) => {
    setMatchWinner(winner)
    eventsStream?.close()
  }

  /**
   * Handle a single match event
   * @param {{ type: string, payload: object }} event
   * @returns {Promise<void>}
   */
  const handleEvent = useCallback(async (event) => {
    switch (event.type) {
      case MatchEventTypes.Player1Join:
        onPlayer1JoinEvent(event.payload)
        break
      case MatchEventTypes.Player2Join:
        onPlayer2JoinEvent(event.payload)
        break
      case MatchEventTypes.Player1Moved:
        await onPlayer1MovedEvent(event.payload)
        break
      case MatchEventTypes.Player2Moved:
        await onPlayer2MovedEvent(event.payload)
        break
      case MatchEventTypes.NewTurn:
        onNewTurnEvent(event.payload)
        break
      case MatchEventTypes.TurnEnded:
        await onTurnEndedEvent(event.payload)
        break
      case MatchEventTypes.MatchEnded:
        onMatchEndedEvent(event.payload)
        break
    }
  }, [onTurnEndedEvent])

  /**
   * Callback triggered when match events stream connects
   * @param event
   */
  const onMatchEventsStreamOpen = (event) => console.log('onopen', event)

  /**
   * Callback triggered when match events stream outputs an error
   * @param error
   */
  const onMatchEventsStreamError = (error) => console.log('onerror', error)

  /**
   * Callback triggered when match events stream receives a new message
   * @param message
   */
  const onMatchEventsStreamMessage = useCallback(async (message) => {
    console.log('onmessage', message)
    const data = JSON.parse(message.data)

    // When first opening the stream connection, all past event history are sent by the server as an array, and we don't want to handle them
    if (!Array.isArray(data)) {
      await handleEvent(data)
    }
  }, [handleEvent])

  /**
   * Load match data when mounting the component
   */
  useEffect(() => {
    loadMatch()
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

  /**
   * Calculate usernames when match data is retrieved
   */
  useEffect(() => {
    if (match) {
      setUsernamePlayer1(match.user1?.username)
      setUsernamePlayer2(match.user2?.username)
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

  /**
   * Calculate match winner when match data is retrieved
   */
  useEffect(() => {
    if (match?.winner) {
      setMatchWinner(match.winner.username)
    }
  }, [match])

  /**
   * Subscribe to match notifications when mounting the component if match is not finished (no winner yet)
   * Close subscription when component is unmounted
   */
  useEffect(() => {
    if (match && !match?.winner) {
      eventsStream = fetchMatchEvents(match._id)
      eventsStream.onopen = onMatchEventsStreamOpen
      eventsStream.onerror = onMatchEventsStreamError
      eventsStream.onmessage = onMatchEventsStreamMessage
    }

    return () => eventsStream?.close()
  }, [match])

  return (
    <>
    <BackButton />
    <Logout />
    <div className="bg-white px-10 py-8 rounded-xl min-w-[50%] shadow-md">
      <div className='space-y-6'>
        { matchWinner && (
        <div className='relative'>
          <h1 className="text-center text-3xl font-semibold py-10 text-indigo-600 text-bold">The Winner is {matchWinner}.
            <img className="w-56 absolute animate-pulse" src={firework}/>
          </h1>
        </div>
      )}
        <div className='space-y-4'>
          { turnId && turnId <= MATCH_MAXIMUM_TURNS && (
          <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Choose a move</h1>
          )}
          { turnId && turnId <= MATCH_MAXIMUM_TURNS && (
            <h2 className="text-center text-2xl font-semibold text-gray-600">Turn {turnId}</h2>
          )}
        </div>
        { turnId && turnId <= MATCH_MAXIMUM_TURNS && (
          <div className="grid grid-cols-2 gap-x-20">
            <MatchMoves usernamePlayer1={usernamePlayer1} turnId={turnId} matchId={matchId} card={usernamePlayer1 === connectedUser.username ? "visible" : "secret" }/>
            { usernamePlayer2
              ? <MatchMoves usernamePlayer2={usernamePlayer2} turnId={turnId} matchId={matchId} card={usernamePlayer2 === connectedUser.username ? "visible" : "secret" }/>
              : <Loader />
            }
          </div>
        )}
        <h2 className="text-center my-8 text-xl font-semibold text-gray-600">Score</h2>
        <MatchScore usernamePlayer1={usernamePlayer1} usernamePlayer2={usernamePlayer2} player1Score={player1Score} player2Score={player2Score}/>
      </div>
      <h2 className="text-center my-6 text-xl font-semibold text-gray-600">History</h2>
      <div className='space-y-4'>
        <MatchHistory match={match} usernamePlayer1={usernamePlayer1} usernamePlayer2={usernamePlayer2} />
      </div>
    </div>
    </>
  );
}

export default Match;
