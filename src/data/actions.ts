import { state } from './state';
import { timestampToDuration } from './util';

export const IDENTIFIER = 'aha-develop.timer';

const ahaFetch = (path: RequestInfo, options: RequestInit = {}) => {
  const { headers, ...rest } = options;
  const csrfToken = document
    .querySelector('meta[name=csrf-token]')
    .getAttribute('content');

  return fetch(path, {
    credentials: 'same-origin',
    mode: 'cors',
    headers: {
      ...headers,
      'x-csrf-token': csrfToken,
    },
    ...rest,
  });
};

export const loadTimers = async () => {
  const fields = await aha.user.getExtensionFields(IDENTIFIER);
  const timers = fields.map(f => {
    const values = f.name.replace('timer:', '').split(':');
    return {
      recordId: values[0],
      recordType: values[1],
      startedAt: new Date(f.value),
    };
  });

  state.timers = timers;
};

export const startTimer = async record => {
  const now = new Date();

  await aha.user.setExtensionField(
    IDENTIFIER,
    `timer:${record.id}:${record.typename}`,
    +now
  );

  // Add new timer
  state.timers.push({
    recordId: record.id,
    recordType: record.typename,
    startedAt: now,
  });
};

export const stopTimer = async (record, usingMinutes) => {
  const timer = state.timers.filter(t => t.recordId === record.id)[0];

  await aha.user.clearExtensionField(
    IDENTIFIER,
    `timer:${record.id}:${record.typename}`
  );

  if (usingMinutes) {
    await logWork(record, timer.startedAt);
  }

  // Remove old timer
  state.timers = state.timers.filter(t => t.recordId !== record.id);
};

export const logWork = async (record, startTime) => {
  const elapsed = timestampToDuration(startTime);
  if (elapsed.hours === 0 && elapsed.minutes === 0 && elapsed.seconds < 60) {
    return; // Not possible to log less than one minute of effort
  }

  const workDoneText = `${elapsed.hours}h ${elapsed.minutes}min ${elapsed.seconds}s`;
  const data = {
    user_id: aha.user.id,
    work_done_text: workDoneText,
  };

  return await ahaFetch(`/api/v1/features/${record.id}/time_tracking_events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
