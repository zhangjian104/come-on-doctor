import { _decorator, Component, Node } from 'cc';
import { ComponentBase } from './ComponentBase';
import { Message } from './Message';
const { ccclass, property } = _decorator;

@ccclass('MessageCenter')
export class MessageCenter {
  // 管理类列表
  static managers: ComponentBase[] = [];

  // 发送消息
  private static sendMessage(msg: Message) {
    // console.log(this.managers);

    for (let manager of this.managers) {
      manager.receiveMessage(msg);
    }
  }

  static sendCustomMessage(type: number, command: number, content: any) {
    const msg = new Message(type, command, content);

    this.sendMessage(msg);
  }
}
