/** @jsx jsx */
import React, { useEffect, useState } from 'react';
import { jsx, css } from '@emotion/react';
import { ElapsedTime } from './ElapsedTime';
import { stopTimer, IDENTIFIER } from '../data/actions';

export const Timer = ({ recordId, recordType, startTime }) => {
  const [data, setData] = useState<Aha.Feature | Aha.Requirement>(null);
  const [loading, setLoading] = useState(true);

  const loadRecord = async () => {
    const data = await aha.models[recordType]
      .select('id', 'name', 'referenceNum', 'path')
      .merge({ release: aha.models.Release.select('id', 'capacityUnits') })
      .findBy({ id: recordId });

    if (data) {
      setData(data);
    } else {
      // Clear the extension field if the record can't be found - the user lost access to it
      aha.user.clearExtensionField(
        IDENTIFIER,
        `timer:${recordId}:${recordType}`
      );
    }

    setLoading(false);
  };

  const onStop = e => {
    e.preventDefault();
    e.stopPropagation();
    stopTimer(data, data?.release?.capacityUnits === 'MINUTES');
  };

  useEffect(() => {
    loadRecord();
  }, [recordId, recordType]);

  if (loading) {
    return <aha-spinner size='18px' stroke='2px' />;
  }

  if (!data) {
    return null;
  }

  return (
    <div
      className='card card--unstyled'
      css={css`
        background-color: var(--theme-primary-background);
        pointer-events: all;
      `}
    >
      <div className='card__body-wrapper'>
        <div className='card__body' data-drawer-url={data.path}>
          <div className='card__row'>
            <div
              className='card__section'
              css={css`
                flex-wrap: nowrap;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              `}
            >
              <div className='card__field'>{data.referenceNum}</div>
              <div className='card__field'>
                <a>{data.name}</a>
              </div>
            </div>
            <div className='card__section'></div>
          </div>
          <div className='card__row'>
            <div className='card__section'>
              <div className='card__field'>
                <h4 className='m-0'>
                  <ElapsedTime startTime={startTime} />
                </h4>
              </div>
            </div>
            <div className='card__section'>
              <div className='card__field'>
                <aha-button size='small' onClick={onStop}>
                  Stop
                </aha-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
