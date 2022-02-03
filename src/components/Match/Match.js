import { useParams } from 'react-router-dom';
import {useState, useEffect, useCallback} from "react";

import { fetchMatch, fetchMatchEvents } from '../../data/api';
import Logout from "../Security/Logout";
import MatchScore from "./MatchScore"
import MatchHistory from './MatchHistory';
import MatchMoves from './MatchMoves';
import Loader from "../Style/Loader";
import { getConnectedUser } from '../../data/storage';

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
  const connectedUserUsername = getConnectedUser().username

  async function loadMatch() {
    try {
      const data = await fetchMatch(matchId)
      setMatch(data)
    } catch (err) {
      setError(err)
    }
  }

  /**
   * Load match data when mounting the component
   */
  useEffect(() => {
    loadMatch()
  }, [matchId])

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
   * @param {number} turn
   * @returns {Promise<void>}
   */
  const onPlayer1MovedEvent = async ({ turn }) => {
    await loadMatch()
  }

  /**
   * Callback when receiving Player2Moved event
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
   * @param {number} newTurnId
   * @param {string} winner
   */
  const onTurnEndedEvent = useCallback(({ newTurnId, winner }) => {
    if (winner === 'user1') setPlayer1Score(player1Score + 1)
    else if (winner === 'user2') setPlayer2Score(player2Score + 1)

    setTurnId(newTurnId)
  }, [setPlayer1Score, setPlayer2Score, player1Score, player2Score])

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
        onTurnEndedEvent(event.payload)
        break
      case MatchEventTypes.MatchEnded:
        onMatchEndedEvent(event.payload)
        break
    }
  }, [onTurnEndedEvent])

  /**
   * Handle an array of match events
   * @param {{ type: string, payload: object }[]} events
   * @returns {Promise<void>}
   */
  const handleEvents = useCallback(async (events) => {
    for (const event of events) {
      await handleEvent(event)
    }
  }, [handleEvent])

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

    // When first opening the stream connection, all past event history are sent by the server as an array
    if (Array.isArray(data)) {
      await handleEvents(data)
    } else {
      await handleEvent(data)
    }
  }, [handleEvent])

  /**
   * Subscribe to match notifications when mounting the component
   * Close subscription when component is unmounted
   */
  useEffect(() => {
    eventsStream = fetchMatchEvents(matchId)
    eventsStream.onopen = onMatchEventsStreamOpen
    eventsStream.onerror = onMatchEventsStreamError
    eventsStream.onmessage = onMatchEventsStreamMessage

    return () => eventsStream?.close()
  }, [matchId])

  return (
    <>
    <Logout />
    <div className="bg-white px-10 py-8 rounded-xl min-w-[50%] shadow-md">
      <div className='space-y-6'>
        { matchWinner && (
        <div>
          <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Winner</h1>
          <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">{matchWinner}</h1>
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
            <MatchMoves usernamePlayer1={usernamePlayer1} turnId={turnId} matchId={matchId} card={usernamePlayer1 === connectedUserUsername ? "visible" : "secret" }/>
            { usernamePlayer2
              ? <MatchMoves usernamePlayer2={usernamePlayer2} turnId={turnId} matchId={matchId} card={usernamePlayer2 === connectedUserUsername ? "visible" : "secret" }/>
              : <Loader />
            }
          </div>
        )}
        <h2 className="text-center my-8 text-xl font-semibold text-gray-600">Score</h2>
        <MatchScore usernamePlayer1={usernamePlayer1} usernamePlayer2={usernamePlayer2} player1Score={player1Score} player2Score={player2Score}/>
      </div>
      <h2 className="text-center my-6 text-xl font-semibold text-gray-600">History</h2>
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
