import {useState, useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom";

import Loader from "../Style/Loader";
import { fetchMatches, postMatch } from '../../data/api'
import MatchListItem from "./MatchListItem";
import Logout from "../Security/Logout";
import { getConnectedUser } from '../../data/storage';

function MatchList() {
  const navigate = useNavigate()
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState()
  const [isCreateButtonVisible, setIsCreateButtonVisible] = useState(true);
  const [isDataLoading, setDataLoading] = useState(false)
  const connectedUser = getConnectedUser()

  /**
   * Load matches data when mounting the component
   */
  useEffect(() => {
    async function loadMatches() {
      setDataLoading(true)

      try {
        const data = await fetchMatches()
        setMatches(data)
      } catch (err) {
        setError(err)
      } finally {
        setDataLoading(false)
      }
    }

    loadMatches()
  }, [])

  /**
   * Hide button when a match is waiting for a user2
   */
  useEffect(() => {
    const isInvisible = matches.some(match => match.user2 === null)
    setIsCreateButtonVisible(!isInvisible)
  }, [matches])

  /*useEffect(() => {
    matches?.map((match) => (
      match.turns 
      && match.turns.length > 0 
      && !match.winner
      && !match.turns[match.turns.length-1].winner
      && match.turns[match.turns.length-1].user1
      && match.user1.username !== connectedUser.username
      && console.log(match)
    ))
  }, [matches])*/

  /**
   * Onclick create a match and redirect to the match
   */
  const handleClickCreate = useCallback( async () => {
    try {
      const match = await postMatch()
      navigate(`/match/${match._id}`);
    } catch (err) {
      setError(err)
    }
  }, [matches])

  return (
    <>
      <Logout />
      <div style={{ maxHeight:"75vh"}} className="overflow-hidden bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-md">
        <div className="space-y-6">
          <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Matches</h1>
          <div>
            {isDataLoading ? (
              <Loader />
            ) : (
              <div style={{ maxHeight:"52vh"}} className="overflow-scroll flex flex-col items-center text-xl text-gray-600 font-semibold">
                <h2 className="my-4">Other matches</h2>
                {matches?.map((match) => (
                  match.turns && !match.winner && <MatchListItem key={match._id} id={match._id} user1={match.user1} user2={match.user2} />
                ))}
                <h2 className="my-4">Match Ended</h2>
                {matches?.map((match) => (
                  match.winner && <MatchListItem key={match._id} id={match._id} user1={match.user1} user2={match.user2} />
                ))}
              </div>
            )}
            { isCreateButtonVisible &&
              <div
                onClick={handleClickCreate}
                className="hover:cursor-pointer hover:scale-110 hover:duration-150	mt-4 w-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 py-2 rounded-md text-lg tracking-wide">
                Create a match
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );

}

export default MatchList;
