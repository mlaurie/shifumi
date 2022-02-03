import {useState, useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom";

import Loader from "../Style/Loader";
import { fetchMatches, postMatch } from '../../data/api'
import MatchListItem from "./MatchListItem";
import Logout from "../Security/Logout";

function MatchList() {
  const navigate = useNavigate()
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState()
  const [isCreateButtonVisible, setIsCreateButtonVisible] = useState(true);
  const [isDataLoading, setDataLoading] = useState(false)

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
      <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-md">
        <div className="space-y-6">
          <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Matches</h1>
          <div>
            {isDataLoading ? (
              <Loader />
            ) : (
              <div className="flex flex-col items-center text-xl text-gray-600 font-semibold">
                {matches?.map((match) => (
                  <MatchListItem key={match._id} id={match._id} user1={match.user1} user2={match.user2} />
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
