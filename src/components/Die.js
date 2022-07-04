import './Die.css';

export default function Die({ value, isHeld, holdDice }) {
  let dots = Array(value)
    .fill(0)
    .map((_, i) => <span key={i} className='dot' />);

  return (
    <div onClick={holdDice} className={`dice-face ${isHeld && 'dice-held'}`}>
      {dots}
    </div>
  );
}
