import { createMachine } from 'xstate';

console.log(createMachine);
// 创建主角的状态机
const squashMachine = createMachine({
  id: 'squashPlayer',
  initial:'idle',
  states:{
     // 默认状态
     idle:{},
     // 行走状态
     move:{}
  }
});
