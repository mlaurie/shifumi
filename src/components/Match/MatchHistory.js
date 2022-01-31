function MatchHistory({ index, turnUser1, turnUser2, usernamePlayer1, usernamePlayer2 }) {

  return (
    <div style={{ marginTop: 0 }}>Turn {index + 1} -- { usernamePlayer1} : {turnUser1} | {usernamePlayer2} : {turnUser2}</div>
  );
}

export default MatchHistory;