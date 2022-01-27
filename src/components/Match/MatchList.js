import { useState, useEffect } from "react";
import Loader from "../Style/Loader";
import { useNavigate } from 'react-router-dom';

function MatchList() {

  const [matches, setMatches] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isDataLoading, setDataLoading] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    setDataLoading(true)
    fetch('http://fauques.freeboxos.fr:3000/matches', {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
    })
      .then((response) => response.json()
      .then((matches) => {
        setMatches(matches)
        for (const match in matches) {
          if (matches[match].user1 | matches[match].user2 === null) {
            setIsVisible(false)
          };
        }
        setDataLoading(false)
      })
      .catch((error) => console.log(error))
    )
  }, [setMatches])

  function handleClickMatch(e) {
    e.preventDefault();
    navigate('/match/'+ e.currentTarget.dataset.id);
  }

  function handleClickCreate() {
    setDataLoading(true)
    fetch('http://fauques.freeboxos.fr:3000/matches', {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
    })
      .then((response) => response.json()
      .then((match) => {
        matches.push(match)
        for (const match in matches) {
          if (matches[match].user1 | matches[match].user2 === null) {
            setIsVisible(false)
          };
        }
        setDataLoading(false)
      })
      .catch((error) => console.log(error))
    )
  }

  return (

    <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-md">
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Matches</h1>
        <div>
        {isDataLoading ? (
          <Loader />
        ) : (
        <div className="flex flex-col items-center text-xl text-gray-600 font-semibold">
          {matches?.map((data, id) => (
            <div 
              data-id={data._id} 
              onClick={(e) => handleClickMatch(e)} 
              className="my-4 w-full hover:cursor-pointer hover:scale-110 hover:duration-150 hover:rounded-xl hover:drop-shadow-2xl grid grid-cols-3" key={id}>
              <div className={data.user1 ? "not-italic" : "italic font-light"}>{data.user1 ? data.user1.username : "null" }</div>
              <div className="bg-indigo-600 mx-6 text-white rounded-3xl"> VS </div>
              <div className={data.user2 ? "not-italic" : "italic font-light" }>{data.user2 ? data.user2.username : "null"}</div>
            </div>
            
          ))}
        </div>
        )}
        { isVisible &&
          <div 
            onClick={() => handleClickCreate()} 
            className="hover:cursor-pointer hover:scale-110 hover:duration-150	mt-4 w-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-indigo-100 py-2 rounded-md text-lg tracking-wide">
            Create a match
          </div>
        }
        </div>
        </div>
    </div>
  
  );

}

export default MatchList;