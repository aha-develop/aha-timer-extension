import React from 'react';
import ReactDOM from 'react-dom';
import { TimerContainer } from '../components/TimerContainer';
import { TimerField } from '../components/TimerField';
import { state } from '../data/state';

const installTimerContainer = () => {
  let container: HTMLDivElement = document.querySelector('#timer');

  if (container) {
    ReactDOM.unmountComponentAtNode(container);
  } else {
    container = document.createElement('div');
    container.id = 'timer';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);
  }

  ReactDOM.render(<TimerContainer state={state} />, container);
};

aha.on('timer', ({ record }, {}) => {
  return <TimerField state={state} record={record} />;
});

installTimerContainer();
document.addEventListener('page:load', installTimerContainer);
