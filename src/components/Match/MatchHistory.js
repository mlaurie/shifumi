function MatchHistory({ index, turnUser1, turnUser2}) {

  return (
    <div style={{ marginTop: 0 }}>Turn {index + 1} -- player 1 : {turnUser1} | player 2 : {turnUser2}</div>
  );
}

export default MatchHistory;