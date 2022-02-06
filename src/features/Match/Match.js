import { useParams } from 'react-router-dom';
import {useState, useEffect, useCallback} from "react";

import { fetchMatch, fetchMatchEvents } from '../../shared/data/api';
import { timeout } from "../../shared/utils/timeout";
import { getConnectedUser } from '../../shared/data/storage';
import BackButton from "../../shared/components/buttons/BackButton";
import firework from '../../shared/assets/images/firework.png';
import Loader from "../../shared/components/loaders/Loader";

import Logout from "../Auth/Logout";
import MatchScore from "./MatchScore"
import MatchHistory from './MatchHistory';
import MatchMoves from './MatchMoves';


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
const REVEAL_DURATION = 3000

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
  const [turnsHistory, setTurnsHistory] = useState([]);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [player1Move, setPlayer1Move] = useState('');
  const [player2Move, setPlayer2Move] = useState('');
  const [usernamePlayer1, setUsernamePlayer1] = useState('');
  const [usernamePlayer2, setUsernamePlayer2] = useState('');
  const [matchWinner, setMatchWinner] = useState('');
  const connectedUser = getConnectedUser()

  /**
   * Callback when receiving Player1Join event
   * @param {string} user
   */
  const onPlayer1JoinEvent = useCallback(({ user }) => {
    setUsernamePlayer1(user)
  }, [])

  /**
   * Callback when receiving Player2Join event
   * @param {string} user
   */
  const onPlayer2JoinEvent = useCallback(({ user }) => {
    setUsernamePlayer2(user)
  }, [])

  /**
   * Callback when receiving Player1Moved event
   *
   * This event gives us no exploitable information about the move,
   * so we need to fetch the entire match to get the player 1 move
   * @param {number} turn
   * @returns {Promise<void>}
   */
  const onPlayer1MovedEvent = useCallback(async ({ turn }) => {
    try {
      const match = await fetchMatch(matchId)
      const move = match?.turns?.[turn - 1]?.user1
      setPlayer1Move(move)
    } catch (err) {
      setError(err)
    }
  }, [matchId])

  /**
   * Callback when receiving Player2Moved event
   *
   * This event gives us no exploitable information about the move,
   * so we need to fetch the entire match to get the player 2 move
   * @param {number} turn
   * @returns {Promise<void>}
   */
  const onPlayer2MovedEvent = useCallback(async ({ turn }) => {
    try {
      const match = await fetchMatch(matchId)
      const move = match?.turns?.[turn - 1]?.user2
      setPlayer2Move(move)
    } catch (err) {
      setError(err)
    }
  }, [matchId])

  /**
   * Callback when receiving NewTurn event
   * @param {number} turnId
   */
  const onNewTurnEvent = useCallback(({ turnId }) => {
    setTurnId(turnId)
  }, [])

  /**
   * Callback when receiving TurnEnded event
   *
   * This event gives us no exploitable information about the move,
   * so we need to fetch the entire match to recalculate the current match state
   * @param {number} newTurnId
   * @param {string} winner
   */
  const onTurnEndedEvent = useCallback(async ({ newTurnId, winner }) => {
    try {
      const match = await fetchMatch(matchId)
      const moveUser1 = match?.turns?.[newTurnId - 2]?.user1
      const moveUser2 = match?.turns?.[newTurnId - 2]?.user2
      const score1 = match.turns.reduce((score, turn) => score + (turn?.winner === 'user1' ? 1 : 0), 0)
      const score2 = match.turns.reduce((score, turn) => score + (turn?.winner === 'user2' ? 1 : 0), 0)

      setPlayer1Move(moveUser1)
      setPlayer2Move(moveUser2)

      await timeout(REVEAL_DURATION)

      setPlayer1Score(score1)
      setPlayer2Score(score2)

      setPlayer1Move('')
      setPlayer2Move('')
      setTurnsHistory(match.turns)
      setTurnId(newTurnId)
    } catch (err) {
      setError(err)
    }
  }, [matchId])

  /**
   * Callback when receiving MatchEnded event
   * @param {string} winner
   */
  const onMatchEndedEvent = useCallback(async ({ winner }) => {
    setMatchWinner(winner)
    eventsStream?.close()
  }, [eventsStream])

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
        await onMatchEndedEvent(event.payload)
        break
      default:
        break
    }
  }, [onTurnEndedEvent, onMatchEndedEvent, onPlayer1MovedEvent, onPlayer2MovedEvent, onNewTurnEvent, onPlayer1JoinEvent, onPlayer2JoinEvent])

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
    async function loadMatch (matchId) {
      try {
        const data = await fetchMatch(matchId)
        setMatch(data)
      } catch (err) {
        setError(err)
      }
    }

    loadMatch(matchId)
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
   * Calculate match turns history when match data is retrieved
   */
  useEffect(() => {
    if (Array.isArray(match?.turns)) {
      setTurnsHistory(match.turns)
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
              <img className="w-56 absolute animate-pulse" src={firework} alt="firework" />
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
              <MatchMoves
                usernamePlayer1={usernamePlayer1}
                turnId={turnId}
                matchId={matchId}
                selectedMove={player1Move || match?.turns[turnId - 1]?.[usernamePlayer1 === connectedUser.username ? 'user1': undefined]}
                card={player1Move || usernamePlayer1 === connectedUser.username ? "visible" : "secret"}
              />
              { usernamePlayer2 ? (
                <MatchMoves
                    usernamePlayer2={usernamePlayer2}
                    turnId={turnId}
                    matchId={matchId}
                    selectedMove={player2Move || match?.turns[turnId - 1]?.[usernamePlayer2 === connectedUser.username ? 'user2': undefined]}
                    card={player2Move || usernamePlayer2 === connectedUser.username ? "visible" : "secret" }
                />
              ) : <Loader />}
            </div>
          )}
          <MatchScore usernamePlayer1={usernamePlayer1} usernamePlayer2={usernamePlayer2} player1Score={player1Score} player2Score={player2Score}/>
        </div>
        <MatchHistory turnsHistory={turnsHistory} usernamePlayer1={usernamePlayer1} usernamePlayer2={usernamePlayer2} />
      </div>
    </>
  );
}

export default Match;
