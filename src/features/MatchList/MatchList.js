import {useState, useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom";

import Loader from "../../shared/components/loaders/Loader";
import AppButton from "../../shared/components/buttons/AppButton";
import { fetchMatches, postMatch } from '../../shared/data/api'
import Logout from "../Auth/Logout";
import MatchListItem from "./MatchListItem";
import MatchListFilter from "./MatchListFilter";

const MatchListFiltersTypes = {
  InProgress: 'IN_PROGRESS',
  Ended: 'ENDED',
  All: 'ALL',
}

const defaultFilteredMatches = {
  [MatchListFiltersTypes.InProgress]: {
    count: 0,
    matches: [],
  },
  [MatchListFiltersTypes.Ended]: {
    count: 0,
    matches: [],
  },
  [MatchListFiltersTypes.All]: {
    count: 0,
    matches: [],
  },
}

function MatchList() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState(MatchListFiltersTypes.InProgress);
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState(defaultFilteredMatches);
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
   * Pre-calculate all filtered lists when matches or filter change
   */
  useEffect(() => {
    const matchesInProgress = matches.filter(match => match.winner === undefined)
    const matchesEnded = matches.filter(match => match.winner !== undefined)
    const matchesAll = matches.filter(match => match)

    setFilteredMatches({
      [MatchListFiltersTypes.InProgress]: {
        count: matchesInProgress.length,
        matches: matchesInProgress,
      },
      [MatchListFiltersTypes.Ended]: {
        count: matchesEnded.length,
        matches: matchesEnded,
      },
      [MatchListFiltersTypes.All]: {
        count: matchesAll.length,
        matches: matchesAll,
      },
    })
  }, [filter, matches])

  /**
   * Hide button when a match is waiting for a user2
   */
  useEffect(() => {
    const isInvisible = matches.some(match => match.user2 === null)
    setIsCreateButtonVisible(!isInvisible)
  }, [matches])

  /**
   * Callback when clicking IN_PROGRESS filter
   */
  const handleClickFilterInProgress = useCallback(() => {
    setFilter(MatchListFiltersTypes.InProgress)
  }, [])

  /**
   * Callback when clicking ENDED filter
   */
  const handleClickFilterEnded = useCallback(() => {
    setFilter(MatchListFiltersTypes.Ended)
  }, [])

  /**
   * Callback when clicking ALL filter
   */
  const handleClickFilterAll = useCallback(() => {
    setFilter(MatchListFiltersTypes.All)
  }, [])

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
  }, [])

  return (
    <>
      <Logout />
      <div style={{ maxHeight:"80vh"}} className="overflow-hidden bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-md">
        <div className="space-y-6">
          <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Matches</h1>
          { isDataLoading ? (
            <Loader />
          ) : (
            <>
              <div className="flex">
                <MatchListFilter
                  onClick={handleClickFilterInProgress}
                  selected={filter === MatchListFiltersTypes.InProgress}
                  title={`Playing (${filteredMatches[MatchListFiltersTypes.InProgress].count})`}
                />
                <MatchListFilter
                  onClick={handleClickFilterEnded}
                  selected={filter === MatchListFiltersTypes.Ended}
                  title={`Ended (${filteredMatches[MatchListFiltersTypes.Ended].count})`}
                />
                <MatchListFilter
                  onClick={handleClickFilterAll}
                  selected={filter === MatchListFiltersTypes.All}
                  title={`All (${filteredMatches[MatchListFiltersTypes.All].count})`}
                />
              </div>

              <div>
                <div style={{ maxHeight:"52vh"}} className="overflow-scroll flex flex-col items-center text-xl text-gray-600 font-semibold">
                  {filteredMatches[filter].matches.map((match) => <MatchListItem key={match._id} id={match._id} user1={match.user1} user2={match.user2} />)}
                </div>
                { isCreateButtonVisible &&
                  <AppButton title={'Create a match'} onClick={handleClickCreate} />
                }
              </div>
            </>
          ) }
        </div>
      </div>
    </>
  );
}

export default MatchList;
