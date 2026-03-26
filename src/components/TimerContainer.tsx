/** @jsx jsx */
import React, { useEffect } from 'react';
import { jsx, css } from '@emotion/react';
import { Timer } from '../components/Timer';
import { useSnapshot } from 'valtio';
import { loadTimers } from '../data/actions';

const HorizontalRow = ({ children }) => (
  <div
    css={css`
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 999;

      display: grid;
      grid-gap: 10px;
      grid-auto-columns: 200px;
      grid-template-rows: 60px;
      grid-auto-flow: column;

      margin: 16px;
    `}
  >
    {children}
  </div>
);

export const TimerContainer = ({ state }) => {
  const { timers } = useSnapshot(state);

  useEffect(() => {
    loadTimers();

    const pid = setInterval(loadTimers, 60 * 1000); // refresh timers regularly to support people using multiple tab
    return () => clearInterval(pid);
  }, []);

  return (
    <HorizontalRow>
      {timers.map(timer => {
        return (
          <Timer
            recordId={timer.recordId}
            recordType={timer.recordType}
            startTime={timer.startedAt}
          />
        );
      })}
    </HorizontalRow>
  );
};
