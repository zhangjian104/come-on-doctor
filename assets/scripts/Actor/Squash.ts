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
} from 'cc';

import { ComponentBase } from '../framework/ComponentBase';
import { Message, MessageType } from '../framework/Message';
import { MessageCenter } from '../framework/MessageCenter';
import { ActorManager } from './ActorManager';
import { changeVector } from '../util';

import { service } from '../machine/squash.machine';

const { ccclass, property } = _decorator;
const eventTarget = new EventTarget();

/**
 * 主角状态
 * 默认状态：播放抖动动画
 *
 */

@ccclass('Squash')
export class Squash extends ComponentBase {
  private speed: number = 300;

  private _moveDirection: Vec2 | undefined;

  // 主角朝向
  private direction: number = 1;

  private squash: Node;
  private squash_back: Node;
  private squash_arrow: Node;
  private squash_weapon: Node;

  private contact = {
    isContact: false,
    // 区分四面墙tag
    tag: 0,
  };

  start() {
    // 注册为ui的消息接受者
    ActorManager.Instance.registerReceiver(this);

    this.squash = this.node.getChildByName('squash');
    this.squash_back = this.node.getChildByName('squash_back');
    this.squash_arrow = this.node.getChildByName('arrow');
    this.squash_weapon = this.node.getChildByName('weapon');

    console.log('当前状态');
    console.log(service.state.value);

    setTimeout(() => {
      console.log('2s后进入行动状态');

      service.send('MOVING');
      console.log('当前状态');
      console.log(service.state.value);
    }, 2000);

    // 注册单个碰撞体的回调函数
    let collider = this.getComponent(Collider2D);

    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    console.log('开始碰撞');

    // 只在两个碰撞体开始接触时被调用一次
    this.contact = {
      isContact: true,
      tag: otherCollider.tag,
    };
  }
  onEndContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    console.log('结束碰撞');

    // 只在两个碰撞体结束接触时被调用一次
    this.contact = {
      isContact: false,
      tag: otherCollider.tag,
    };
  }

  receiveMessage(msg: Message) {
    super.receiveMessage(msg);
    if (msg.Command === MessageType.Actor_Squash_MoveIng) {
      this.move(msg.Content);
    }
    if (msg.Command === MessageType.Actor_Squash_MoveEnd) {
      this.move(msg.Content);
    }
  }
  public move(direction: Vec2) {
    this._moveDirection = direction;
  }

  private changePlayerByDirection(lor, tob) {
    // 上左
    if (lor && tob) {
      this.squash_back.setRotationFromEuler(0, 0, 0);
      this.squash.active = false;
      this.squash_back.active = true;
    }
    // 上右
    if (!lor && tob) {
      this.squash_back.setRotationFromEuler(0, 180, 0);

      this.squash.active = false;
      this.squash_back.active = true;
    }
    // / 下左
    if (lor && !tob) {
      this.squash.setRotationFromEuler(0, 0, 0);

      this.squash.active = true;
      this.squash_back.active = false;
    }
    //下右
    if (!lor && !tob) {
      this.squash.setRotationFromEuler(0, 180, 0);

      this.squash.active = true;
      this.squash_back.active = false;
    }
  }

  update(deltaTime: number) {
    if (!this._moveDirection) return;

    // 求主角与箭头的夹角
    const _angle = this._moveDirection.angle(
      v2(this.squash_arrow.worldPosition.x, this.squash_arrow.worldPosition.y)
    );
    const arrowAngle =
      this._moveDirection.x > 0
        ? -((_angle * 180) / Math.PI)
        : (_angle * 180) / Math.PI;

    this.squash_arrow.setRotationFromEuler(0, 0, arrowAngle);

    // 武器与箭头（主角运动方向）总是垂直的
    this.squash_weapon.setRotationFromEuler(0, 0, arrowAngle - 120);


    const pos = new Vec3(
      this._moveDirection.x * this.speed * deltaTime,
      this._moveDirection.y * this.speed * deltaTime,
      0
    );
    const curPos = this.node.position;
    this.node.position = new Vec3(pos.x + curPos.x, pos.y + curPos.y, 0);

    const lor = this._moveDirection.x > 0;
    const tob = this._moveDirection.y > 0;

    // 根据上下左右改变主角的朝向
    this.changePlayerByDirection(lor, tob);
  }
}
