import { Vec3 } from 'cc';
import { createMachine, interpret } from 'xstate';
import { BroadcastRoom } from '../framework/BroadcastRoom';

function playAttackAnim(context, event) {
  console.log('进入打击动画状态');
  // console.log(context, event);
  setTimeout(() => {
    console.log('2s了，动画播放结束');
    service.send('IDLE');
  }, 2000);
}

function goBackToIdle(context, event) {
  console.log('回到静止状态');
  BroadcastRoom.publish('event.squash.back.idle');
}

function startMoving() {
  BroadcastRoom.publish('event.squash.start.moving');
}
// 创建主角的状态机
const squashMachine = createMachine({
  id: 'squashPlayer',

  context: {},

  initial: 'idle',
  states: {
    // 静止状态
    idle: {
      on: {
        MOVING: {
          actions: startMoving,
          target: 'moving',
        },
      },
    },
    // 行走状态
    moving: {
      on: {
        IDLE: {
          actions: goBackToIdle,
          target: 'idle',
        },
        ATTACK: {
          actions: playAttackAnim,
          target: 'attack',
        },
        BE_HIT: {
          target: 'behit',
        },
      },
    },
    // 击球状态
    attack: {
      on: {
        IDLE: {
          actions: goBackToIdle,
          target: 'idle',
        },
      },
    },
    // 主角收到攻击
    behit: {
      on: {
        IDLE: {
          actions: goBackToIdle,
          target: 'idle',
        },
      },
    },
  },
});

export const service = interpret(squashMachine);

service.onTransition((state) => {
  if (state.changed) {
  }
});

service.start();
