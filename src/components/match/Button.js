function Button({ title }) {

    function onClick(e) {
        console.log(e.target.textContent)

        fetch("http://fauques.freeboxos.fr:3000/61b096d105be72d00a5ce3c0/turns/1", {
          method: "POST",
          body: JSON.stringify({ move: e.target.textContent }),
          headers: {
            "content-type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
              console.log(data)
            //setUsers([...users, data]);
          });
    }
    return (
        <button onClick={onClick}>
            {title}
        </button>
    );
} 

export default Button;