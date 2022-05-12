import { createMachine, interpret } from 'xstate';

// 创建主角的状态机
const weaponMachine = createMachine({
  id: 'weapon',
  initial: 'idle',
  states: {
    // 默认不显示小球
    idle: {
      on: {
        ACTIVE: 'active',
      },
    },
    // 小球被激活
    active: {
      on: {
        BE_HIT: 'beHit',
      },
    },
    // 被主角击中
    beHit: {},
  },
});

export const service = interpret(weaponMachine);

service.onTransition((state) => {
  if (state.changed) {
    //  console.log(state.context);
    console.log('监听到状态改变');
  }
});

service.start();
