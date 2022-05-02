import { _decorator, Component, Node, Label } from 'cc';
import { ComponentBase } from '../framework/ComponentBase';
import { Message, MessageType } from '../framework/Message';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('hp')
export class hp extends ComponentBase {
  hp: number = 100;

  start() {
    console.log(UIManager.Instance);
    
    // 注册为ui的消息接受者
    UIManager.Instance.registerReceiver(this);
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
