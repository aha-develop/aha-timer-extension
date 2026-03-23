import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { startTimer, stopTimer } from '../data/actions';
import { ElapsedTime } from './ElapsedTime';

export const TimerField = ({ state, record }) => {
  const { timers } = useSnapshot(state);
  const [loading, setLoading] = useState(true);
  const [capacityUnits, setCapacityUnits] = useState(null);

  const timer = timers.filter(
    t => t.recordId === record.id && t.recordType === record.typename
  )[0];

  const hasTimer = !!timer;

  const canTrackTime = capacityUnits === 'MINUTES';

  useEffect(() => {
    setLoading(true);

    aha.models[record.typename]
      .select('id')
      .merge({
        release: aha.models.Release.select('id', 'capacityUnits'),
      })
      .find(record.id)
      .then(result => {
        setCapacityUnits(result.release.capacityUnits);
        setLoading(false);
      });
  }, [record]);

  if (loading) {
    return <aha-spinner size='18px' stroke='2px' />;
  }

  return (
    <>
      {hasTimer ? (
        <div key='stop'>
          <ElapsedTime startTime={timer.startedAt} />
          &nbsp;
          <aha-button onClick={() => stopTimer(record, canTrackTime)}>
            Stop timer
          </aha-button>
        </div>
      ) : (
        <div key='start'>
          <aha-button
            onClick={() => startTimer(record)}
            disabled={canTrackTime ? undefined : true}
          >
            Start timer
          </aha-button>
          {!canTrackTime && (
            <aha-tooltip>
              Timer unavailable - release not using time-based estimates
            </aha-tooltip>
          )}
        </div>
      )}
    </>
  );
};
