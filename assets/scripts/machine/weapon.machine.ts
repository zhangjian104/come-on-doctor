import { v3 } from 'cc';
import { createMachine, assign, interpret } from 'xstate';
import { BroadcastRoom } from '../framework/BroadcastRoom';

const contactByOne = assign({
  // @ts-ignore
  contactor: (context, event) => event.contact,
  // @ts-ignore
  direction: (context, event) => event.dir,
});

// 创建主角的状态机
const weaponMachine = createMachine({
  id: 'weapon',
  initial: 'idle',
  context: {
    // 谁碰到了小球:墙体，主角，怪物
    contactor: null,
    // 当前方向向量
    direction: v3(0, 0, 0),
  },
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
        // 碰撞到墙体或者怪物
        CONTACT: {
          actions: contactByOne,
          target: 'moving',
        },
      },
    },
    // 小球进入运行状态
    moving: {},
  },
});

export const service = interpret(weaponMachine);

service.onTransition((state) => {});

service.start();
