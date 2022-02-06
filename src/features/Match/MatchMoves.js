import MatchMoveItem from './MatchMoveItem';
import paper from '../../shared/assets/images/paper.png';
import scissors from '../../shared/assets/images/scissors.png';
import rock from '../../shared/assets/images/rock.png';
import secret_move from '../../shared/assets/images/secret_move.png';

function MatchMoves ({ matchId, turnId, usernamePlayer1, usernamePlayer2, card, selectedMove }) {
  return (
    <div>
      <h2 className='mb-4 text-xl'>
        { usernamePlayer1 ? usernamePlayer1 : usernamePlayer2 }
      </h2>
      <div className="flex h-36 text-sm justify-center items-center">
        <div className="self-end">
          <MatchMoveItem
            hidden={selectedMove && selectedMove !== 'paper'}
            selected={selectedMove && selectedMove === 'paper'}
            disabled={selectedMove !== undefined}
            matchId={matchId}
            turnId={turnId}
            move="paper"
            img={card && card === "visible" ? paper : secret_move}
          />
        </div>
        <div className="self-start">
          <MatchMoveItem
            hidden={selectedMove && selectedMove !== 'rock'}
            selected={selectedMove && selectedMove === 'rock'}
            disabled={selectedMove !== undefined}
            matchId={matchId}
            turnId={turnId}
            move="rock"
            img={card && card === "visible" ? rock : secret_move}
          />
        </div>
        <div className="self-end">
          <MatchMoveItem
            hidden={selectedMove && selectedMove !== 'scissors'}
            selected={selectedMove && selectedMove === 'scissors'}
            disabled={selectedMove !== undefined}
            matchId={matchId}
            turnId={turnId}
            move="scissors"
            img={card && card === "visible" ? scissors : secret_move}
          />
        </div>
      </div>
    </div>
  );
}

export default MatchMoves;

