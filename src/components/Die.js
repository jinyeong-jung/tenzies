import './Die.css';

export default function Die({ value, isHeld, holdDice }) {
  return (
    <div onClick={holdDice} className={`dice-face ${isHeld && 'dice-held'}`}>
      <h2 className='dice-number'>{value}</h2>
    </div>
  );
}
