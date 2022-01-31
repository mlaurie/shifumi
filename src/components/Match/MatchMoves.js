import MatchMoveItem from './MatchMoveItem';
import paper from '../../assets/images/paper.png';
import scissors from '../../assets/images/scissors.png';
import rock from '../../assets/images/rock.png';

function MatchMoves ({ matchId, turnId}) {

  return (
    <div className="flex h-44 justify-center items-center">
      <div className="self-end">
        <MatchMoveItem matchId={matchId} turnId={turnId} move="paper" img={paper}/>
      </div>
      <div className="self-start">
        <MatchMoveItem matchId={matchId} turnId={turnId} move="rock" img={rock}/>        
      </div>
      <div className="self-end">
        <MatchMoveItem matchId={matchId} turnId={turnId} move="scissors" img={scissors}/>
      </div>
  </div>
  );
}

export default MatchMoves;