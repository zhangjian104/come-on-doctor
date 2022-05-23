import { EventTarget } from 'cc';
const eventTarget = new EventTarget();

console.log('确保只调用一次');

/**
 * 广播类
 * 用于全局的消息广播
 */
export class BroadcastRoom {
  // 订阅事件并触发回调
  static subscribe(event: string, callback) {
    eventTarget.on(event, callback);
  }
  // 发布事件
  static publish(event: string, context?) {
    eventTarget.emit(event, context);
  }
}
