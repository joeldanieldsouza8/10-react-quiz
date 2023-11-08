import { useEffect, useCallback } from "react";

function Timer({ dispatch, secondsRemaining }) {
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;

  // Using useCallback to memoize the dispatch function to avoid unnecessary re-renders.
  const handleTimerCountdown = useCallback(() => {
    const tickAction = { type: "tick" };
    dispatch(tickAction);
  }, [dispatch]);

  // We create a useEffect hook as we are creating a side effect (a timer) that will run in parallel to the main code.
  // The useEffect hook will run once when the component is first rendered (on 'mount'). So as soon as the component is rendered, the timer will start.
  // See Notion Notes for more details on using functions as dependencies in useEffect. (Titled: When To Use Functions In Dependency Array Of useEffect Hook)
  useEffect(() => {
    // The interval function that wraps the callback.
    // Every setInterval call returns a unique intervalId, which we can use to clear the interval.
    const intervalId = setInterval(handleTimerCountdown, 1000);

    // Cleanup function to clear the interval when the component 'unmounts'.
    // If we didn't use a cleanup function, the interval would continue to run even after the component is unmounted. This is because multiple timers would be running in parallel.
    // This would cause a memory leak.
    return () => clearInterval(intervalId);
  }, [handleTimerCountdown]); // handleTimerCountdown is memoized, it won't change on every render.

  return (
    <div className="timer">
      {mins < 10 ? `0${mins}` : mins}:{secs < 10 ? `0${secs}` : secs}
    </div>
  );
}

export default Timer;
