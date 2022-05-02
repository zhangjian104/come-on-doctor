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
} from 'cc';

import { ComponentBase } from '../framework/ComponentBase';
import { Message, MessageType } from '../framework/Message';
import { MessageCenter } from '../framework/MessageCenter';
import { ActorManager } from './ActorManager';
import { changeVector } from '../util';

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

  // 处理与墙壁的碰撞
  private playerContactWall(curPos, pos) {
    const { isContact, tag } = this.contact;
    console.log(this._moveDirection);

    if (isContact) {
      if (tag === 0 || tag === 1) {
        const dir = !!(tag === 0 || tag === 1);

        this.node.position = new Vec3(
          curPos.x + (dir && 0),
          curPos.y + pos.y,
          0
        );

        if (this._moveDirection.x > 0 && tag === 0) {
          this.contact = {
            isContact: false,
            tag,
          };
        }

        if (this._moveDirection.x < 0 && tag === 1) {
          this.contact = {
            isContact: false,
            tag,
          };
        }
      } else {
        const dirY = !!(tag === 2 || tag === 3);

        this.node.position = new Vec3(
          curPos.x + pos.x,
          curPos.y + (dirY && 0),
          0
        );

        if (this._moveDirection.y < 0 && tag === 2) {
          this.contact = {
            isContact: false,
            tag,
          };
        }

        if (this._moveDirection.y > 0 && tag === 3) {
          this.contact = {
            isContact: false,
            tag,
          };
        }
      }
    } else {
      this.node.position = new Vec3(pos.x + curPos.x, pos.y + curPos.y, 0);
    }
  }

  update(deltaTime: number) {
    if (!this._moveDirection) return;

    const pos = new Vec3(
      this._moveDirection.x * this.speed * deltaTime,
      this._moveDirection.y * this.speed * deltaTime,
      0
    );
    const curPos = this.node.position;
    this.node.position = new Vec3(pos.x + curPos.x, pos.y + curPos.y, 0);
    // this.playerContactWall(curPos, pos);

    const lor = this._moveDirection.x > 0;
    const tob = this._moveDirection.y > 0;
    // 区分左右
    lor
      ? this.node.setRotationFromEuler(0, 0, 0)
      : this.node.setRotationFromEuler(0, 180, 0);
    //  区分上下
    if (tob) {
      this.squash.active = false;
      this.squash_back.active = true;
    } else {
      this.squash.active = true;
      this.squash_back.active = false;
    }
  }
}
