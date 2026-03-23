import { proxy } from 'valtio';

interface Timer {
  recordId: string;
  recordType: string;
  startedAt: Date;
}

interface TimerState {
  timers: Timer[];
}

export const state = proxy<TimerState>({
  timers: [],
});
