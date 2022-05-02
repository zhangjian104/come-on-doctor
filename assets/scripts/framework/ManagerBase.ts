import { ComponentBase } from './ComponentBase';

import { _decorator, Component, Node } from 'cc';
import { Message, MessageType } from './Message';
import { MessageCenter } from './MessageCenter';
const { ccclass, property } = _decorator;

@ccclass('ManagerBase')
export class ManagerBase extends ComponentBase {
  // 子管理类
  ReceiveList: ComponentBase[] = [];
  // 当前管理类接收的消息类型
  messageType: number;

  setMessageType() {
    return MessageType.TypeActor;
  }

  // 注册消息监听
  registerReceiver(cb: ComponentBase) {
    this.ReceiveList.push(cb);
  }

  onLoad() {
    // 设置当前管理类
    this.messageType = this.setMessageType();
    // 把管理类添加到消息中心列表中
    MessageCenter.managers.push(this);
    console.log(this.ReceiveList);
    
  }

  receiveMessage(message: Message) {
    super.receiveMessage(message);
    // console.log('ManagerBase receive message' + message);
    // 判断消息类型
    if (message.Type !== this.messageType) {
      return;
    }
    // 向下层转发消息
    for (let cb of this.ReceiveList) {
      cb.receiveMessage(message);
    }
  }
}
