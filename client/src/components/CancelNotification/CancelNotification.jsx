import { useEffect, useState } from "react";
import "./CancelNotification.scss";

export function CancelNotification({ onStopTimer, initTime }) {
  const [timer, setTimer] = useState(initTime);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    setIntervalId(
      setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000)
    );
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div className="cancell-notification">
      <h2>{timer}</h2>
      <button onClick={onStopTimer}>Отмена</button>
    </div>
  );
}
