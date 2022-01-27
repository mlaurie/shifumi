import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import Button from '../lib/ButtonMove';
import paper from '../../images/paper.png'
import scissors from '../../images/scissors.png'
import rock from '../../images/rock.png'
import Score from './Score'

function Match() {
  const { id } = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const [isDataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    setDataLoading(true)
    fetch(`http://fauques.freeboxos.fr:3000/matches/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
    })
      .then((response) => response.json()
      .then((match) => {
        if (match.turns.lenght === undefined) {
          setIsVisible(true)
        }
        setDataLoading(false)
      })
      .catch((error) => console.log(error))
    )
  }, [])

  return (
    <>
      <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-md max-w-md">
        <div className='space-y-12'>
          <h1 className="text-center text-3xl font-semibold text-indigo-600 text-bold">Choose a move</h1>
          { isVisible ? 
          <div className="flex h-44 justify-center items-center">
            <div className="self-end">
              <Button title="Paper" img={paper}/>
            </div>
            <div className="self-start">
              <Button title="Scissors" img={scissors}/>
            </div>
            <div className="self-end">
              <Button title="Rock" img={rock}/>
            </div>
          </div> : "It's not your turn"}
          <Score />
        </div>
      </div>
    </>
  );

}

export default Match;