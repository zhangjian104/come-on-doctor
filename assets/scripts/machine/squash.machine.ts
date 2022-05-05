import { createMachine, interpret } from 'xstate';

console.log(createMachine);
// 创建主角的状态机
const squashMachine = createMachine({
  id: 'squashPlayer',
  initial: 'idle',
  states: {
    // 默认状态
    idle: {
      on: {
        MOVING: 'moving',
      },
    },
    // 行走状态
    moving: {},
  },
});

export const service = interpret(squashMachine);

service.onTransition((state) => {
  if (state.changed) {
    //  console.log(state.context);
    console.log('监听到状态改变');
  }
});

service.start();
