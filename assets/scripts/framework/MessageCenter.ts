import { _decorator, Component, Node } from 'cc';
import { ComponentBase } from './ComponentBase';
import { Message } from './Message';
const { ccclass, property } = _decorator;

@ccclass('MessageCenter')
export class MessageCenter {
  static components: ComponentBase[] = [];
  // 注册组件
  static registerReceiver(component: ComponentBase) {
    this.components.push(component);
  }
  // 发送消息
  private static sendCustomMessage(msg: Message) {
    for (let component of this.components) {
      component.receiveMessage(msg);
    }
  }

  static sendMessage(command: string, content: any) {
    const msg = new Message(command, content);
    this.sendCustomMessage(msg);
  }
}
