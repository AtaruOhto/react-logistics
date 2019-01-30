import * as React from 'react';

import { mount } from 'enzyme';
import { buildStore } from '../lib';

interface IState {
  messages: string[];
}

const mountApp = () => {
  const context = buildStore<IState>(
    {
      messages: ['Hello', 'Hola', 'Namaste'],
    },
    'sample',
  );
  const MsgListRaw = (props: IState) => (
    <ul>
      {props.messages.map(msg => (
        <li className="spec-msg" key={msg}>
          {msg}
        </li>
      ))}
    </ul>
  );

  const MsgList = context.withConsumer(MsgListRaw);

  return mount(
    <context.Provider>
      <MsgList />
    </context.Provider>,
  );
};

describe('Static', () => {
  test('message item length is correct', () => {
    const wrapper = mountApp();
    expect(wrapper.find('.spec-msg').length).toBe(3);
    expect(wrapper.html()).toContain('Hello');
    expect(wrapper.html()).toContain('Hola');
    expect(wrapper.html()).toContain('Namaste');
    wrapper.unmount();
    const aaa = require('../dist/index');
    console.log(aaa);
  });
});
