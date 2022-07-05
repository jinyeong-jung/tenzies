import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import './App.css';
import Die from './components/Die';
import timerSrc from './images/timer.png';
import recordSrc from './images/record.png';

function App() {
  const STORAGE_KEY = 'record';

  const [dice, setDice] = useState(allNewDice());
  const [tenzies, setTenzies] = useState(false);
  const [time, setTime] = useState(0);
  const [record, setRecord] = useState(getRecord() || 0);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const allSameValue = dice.every((die) => die.value === dice[0].value);

    if (allHeld && allSameValue) {
      setTenzies(true);
    } else {
      setTenzies(false);
    }
  }, [dice]);

  useEffect(() => {
    let interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    if (tenzies) {
      clearInterval(interval);

      if (record === 0 || time < record) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(time));
        setRecord(time);
      }
    }

    return () => clearInterval(interval);
  }, [tenzies, time, record]);

  function getRecord() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  }

  function createNewDie() {
    return {
      id: nanoid(),
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(createNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => (die.isHeld ? die : createNewDie()))
      );
    } else {
      setDice(allNewDice());
      setTenzies(false);
      setTime(0);
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) =>
        die.id === id
          ? {
              ...die,
              isHeld: !die.isHeld,
            }
          : die
      )
    );
  }

  function pad(number, size) {
    let s = String(number);
    while (s.length < (size || 2)) {
      s = '0' + s;
    }
    return s;
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className='title'>Tenzies</h1>
      <p className='instructions'>
        Roll until all dice are the same.
        <br />
        Click each die to freeze it at its current value between rolls.
      </p>
      <div className='dice-container'>{diceElements}</div>
      <div className='timer'>
        <img src={timerSrc} alt='timer' />
        <span>{pad(time, 3)}</span>
      </div>
      {
        <div className='record'>
          <img src={recordSrc} alt='record' />
          <span>{pad(record, 3)}</span>
        </div>
      }
      <button className='roll-dice' onClick={rollDice}>
        {tenzies ? 'New Game' : 'Roll'}
      </button>
    </main>
  );
}

export default App;
