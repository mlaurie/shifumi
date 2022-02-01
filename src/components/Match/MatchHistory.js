function MatchHistory({ index, turnUser1, turnUser2, usernamePlayer1, usernamePlayer2 }) {

  return (
    <>
      <div className="grid grid-cols-3">
        <div className="font-bold">Turn {index + 1}</div>
        <div className="text-left">{usernamePlayer1} : {turnUser1}</div>
        <div className="text-left">{usernamePlayer2} : {turnUser2}</div>
      </div>
    </>
  );
}

export default MatchHistory;