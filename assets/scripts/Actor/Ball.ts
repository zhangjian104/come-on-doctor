import {
  _decorator,
  Node,
  Vec3,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  v2,
  v3,
} from 'cc';

import { ComponentBase } from '../framework/ComponentBase';
import { Message } from '../framework/Message';
import { MessageCenter } from '../framework/MessageCenter';
import { changeVector, contactAndBounce } from '../util';
import { BroadcastRoom } from '../framework/BroadcastRoom';
import { service } from '../machine/weapon.machine';
const { ccclass, property } = _decorator;
@ccclass('Ball')
export class Ball extends ComponentBase {
  private ball: Node;
  private weapon: Node;
  private shadow: Node;
  private speed: number = 300;
  // 当前方向向量
  private _moveDirection: Vec3;

  start() {
    this.weapon = this.node;
    this.ball = this.node.getChildByName('ball');
    this.shadow = this.node.getChildByName('shadow');
    this.weapon.active = false;
    // 2S后激活小球
    this.scheduleOnce(function () {
      this.weapon.active = true;
      service.send('ACTIVE');
    }, 1);

    BroadcastRoom.subscribe('event.ball.behit.squash', (dir) => {
      service.send('CONTACT', { contact: 'squash', dir });
      this._moveDirection = dir;
    });

    // 监听碰撞事件
    let collider = this.getComponent(Collider2D);
    collider.on(Contact2DType.BEGIN_CONTACT, this.onEndContact, this);
  }
  onEndContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    if (!this._moveDirection) return;
    // 通过获取碰撞点的法向量来判断方向是否需要沿着x|轴取镜像
    this._moveDirection = contactAndBounce(contact, this._moveDirection);
  }
  update(deltaTime: number) {
    if (service.state.value !== 'moving') return;
    const pos = new Vec3(
      this._moveDirection.x * this.speed * deltaTime,
      this._moveDirection.y * this.speed * deltaTime,
      0
    );

    const curPos = this.weapon.position;
    this.weapon.position = new Vec3(pos.x + curPos.x, pos.y + curPos.y, 0);
  }
}
