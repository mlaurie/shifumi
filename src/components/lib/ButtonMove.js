import { useState } from 'react';
import { useParams } from 'react-router-dom';

function Button({ title, img, turn }){

  const { id } = useParams();
  const [move, setMove] = useState({move:""});

  function handleClick(e) {
    setMove(e.target.dataset.move)
    fetch(`http://fauques.freeboxos.fr:3000/matches/${id}/turns/${turn}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(move)
    })
      .then((response) => response.json()
      .then(() => {})
    )
  }
  
  return (
    <button className="w-24" >
      <img 
        data-move={title}
        onClick={(e) => handleClick(e)} 
        className="hover:cursor-pointer hover:origin-center hover:scale-110 hover:duration-150 hover:rotate-12" 
        src={img} 
        alt={title}/>
      {title}
    </button>
  );

}

export default Button;