import { _decorator, Component, Node, Label } from 'cc';
import { ComponentBase } from '../framework/ComponentBase';
import { Message } from '../framework/Message';
const { ccclass, property } = _decorator;
import { MessageCenter } from '../framework/MessageCenter';
@ccclass('hp')
export class hp extends ComponentBase {
  hp: number = 100;

  start() {
    // 注册为ui的消息接受者
    MessageCenter.registerReceiver(this);
  }

  // receiveMessage(msg: Message) {
  //   super.receiveMessage(msg);
  //   // console.log('收到改变血量的消息');
  //   // console.log(msg);
  //   if (msg.Command === MessageType.UI_RefreshHp) {
  //     let num = msg.Content;
  //     this.changeHp(num);
  //   }
  // }

  // // 改变血量
  // changeHp(attack) {
  //   // console.log('收到改变血量的消息:' + attack);
  //   this.hp -= attack;
  //   this.node.parent.getComponent(Label).string = this.hp.toString();
  // }
}
