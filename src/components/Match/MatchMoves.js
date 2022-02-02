import MatchMoveItem from './MatchMoveItem';
import paper from '../../assets/images/paper.png';
import scissors from '../../assets/images/scissors.png';
import rock from '../../assets/images/rock.png';

function MatchMoves ({ matchId, turnId, usernamePlayer1, usernamePlayer2 }) {

  return (
    <div>
      <h2 className='mb-4 text-xl'>
        { usernamePlayer1 ? usernamePlayer1 : usernamePlayer2 }
      </h2>
      <div className="flex h-36 text-sm justify-center items-center">
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
    </div>
  );
}

export default MatchMoves;

