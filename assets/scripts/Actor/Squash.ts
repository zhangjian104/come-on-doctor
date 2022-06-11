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
  BoxCollider2D,
  Animation,
} from 'cc';

import { ComponentBase } from '../framework/ComponentBase';
import { Message } from '../framework/Message';
import { MessageCenter } from '../framework/MessageCenter';
import { changeVector, nodeMove } from '../util';
import { BroadcastRoom } from '../framework/BroadcastRoom';
import { service } from '../machine/squash.machine';
import { v2c } from '../framework/utils';

const { ccclass, property } = _decorator;

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
  private weapon_box: Node;
  private ball: Node;

  private contact = {
    isContact: false,
    // 区分四面墙tag
    tag: 0,
  };

  start() {
    // 在消息中心注册，以便全局消息分发
    MessageCenter.registerReceiver(this);

    BroadcastRoom.subscribe('event.squash.back.idle', () => {
      this.weapon_box.active = false;
    });
    BroadcastRoom.subscribe('event.squash.start.moving', () => {
      this.weapon_box.active = true;
    });

    BroadcastRoom.subscribe('squash.moving.direction', (content) => {
      this.move(content);
    });

    BroadcastRoom.subscribe('squash.moved.direction', (content) => {
      this.move(content);
      service.send('IDLE');
    });

    this.squash = this.node.getChildByName('squash');
    this.squash_back = this.node.getChildByName('squash_back');
    // this.squash_arrow = this.node.getChildByName('arrow');
    // this.squash_weapon = this.node.getChildByName('weapon');
    this.weapon_box = this.node.getChildByName('weapon_box');

    this.ball = this.node.parent.getChildByName('weapon');

    // 获取动画组件
    const clips = this.node.getComponents(Animation)[0];
    BroadcastRoom.subscribe('event.squash.attack.play', (content) => {
      // 播放攻击动画
      clips.play();
      // 1s后进入idle状态
      setTimeout(() => {
        service.send('IDLE');
      }, 500);
    });
  }

  onBeginContactFromOut(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {

  }
  onEndContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {


    // 只在两个碰撞体结束接触时被调用一次
    this.contact = {
      isContact: false,
      tag: otherCollider.tag,
    };
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

  //
  private onContactWithBall() {
    const DIS = 100;
    const ANG = 30;
    // 小球的位置
    const ballPos = this.ball.getWorldPosition();

    // 主角当前的位置和方向
    const curPos = this.node.getWorldPosition();
    // const curDirection = ballPos.subtract3f(curPos.x, curPos.y, curPos.z);

    // 主角箭头方向
    // const arrowPos = this.squash_arrow.getWorldPosition();
    // const angle = Vec2.angle(
    //   v2(curDirection.x, curDirection.y),
    //   v2(arrowPos.x, arrowPos.y)
    // );

    // console.log((angle * 180) / Math.PI);

    const distance = Vec2.distance(
      v2(curPos.x, curPos.y),
      v2(ballPos.x, ballPos.y)
    );

    // 当夹角小于n，距离小于len时则判定碰撞
    if (distance < 100) {
      service.send('ATTACK');
      BroadcastRoom.publish('event.ball.behit.squash', this._moveDirection);
    }
  }

  update(deltaTime: number) {
    if (!this._moveDirection) return;

    // 如果当前是attack状态，则暂时不能行动直到状态解除
    if (service.state.value === 'attack') {
      return;
    }

    // 进入moving状态
    service.send('MOVING');

    // 求主角与箭头的夹角
    const _angle = this._moveDirection.angle(
      v2(this.weapon_box.worldPosition.x, this.weapon_box.worldPosition.y)
    );
    const arrowAngle =
      this._moveDirection.x > 0
        ? -((_angle * 180) / Math.PI)
        : (_angle * 180) / Math.PI;

    this.weapon_box.setRotationFromEuler(0, 0, arrowAngle);

    // // 武器与箭头（主角运动方向）总是垂直的
    // this.squash_weapon.setRotationFromEuler(0, 0, arrowAngle - 120);
    nodeMove(this._moveDirection,deltaTime,this.speed,this.node)
   

    const lor = this._moveDirection.x > 0;
    const tob = this._moveDirection.y > 0;

    // 根据上下左右改变主角的朝向
    this.changePlayerByDirection(lor, tob);

    // 处理主角与小球的碰撞
    this.onContactWithBall();
  }
}
