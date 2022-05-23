import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  EventTouch,
  Sprite,
  Vec3,
  Vec2,
  v3,
  v2,
  EventTarget,
  Contact2DType,
  Collider2D,
  IPhysics2DContact,
  UITransform,
  Tween,
  tween,
  bezier,
} from 'cc';

import { ComponentBase } from '../framework/ComponentBase';
import { Message } from '../framework/Message';
import { MessageCenter } from '../framework/MessageCenter';
import { changeVector } from '../util';

import { service } from '../machine/weapon.machine';

const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends ComponentBase {
  private ball: Node;
  private weapon: Node;
  private shadow: Node;
  t = 0;
  start() {
    const self = this;
    // 注册为ui的消息接受者
    MessageCenter.registerReceiver(this);

    // 2S后激活小球
    service.send('ACTIVE');

    this.weapon = this.node;
    this.ball = this.node.getChildByName('ball');
    this.shadow = this.node.getChildByName('shadow');

    // console.log(this.weapon.worldPosition);
  }

  receiveMessage(msg: Message) {
    super.receiveMessage(msg);
  }

  update(deltaTime: number) {}
}
