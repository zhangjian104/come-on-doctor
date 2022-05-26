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
import { changeVector } from '../util';
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
      console.log('小球监听到被主角撞击');
      console.log(dir);
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
    // 当前小球的坐标
    const selfPos = selfCollider.node.getWorldPosition();
    const other = otherCollider.node.name;
    const PI = Math.PI;

    // 分上下左右处理小球的碰撞角度
    // 代码繁琐，但相对逻辑容易看懂；整合代码会让逻辑变复杂
    if (other === 'left') {
      const a = v3(selfPos.x, selfPos.y + 1, 0).subtract(selfPos);
      let angle = v2(this._moveDirection.x, this._moveDirection.y).angle(
        v2(a.x, a.y)
      );
      angle = angle > PI / 2 ? PI - angle : -angle;

      const x = v2(this._moveDirection.x, this._moveDirection.y).rotate(
        angle * 2
      );
      this._moveDirection = v3(x.x, x.y);
    }

    if (other === 'right') {
      const a = v3(selfPos.x, selfPos.y + 1, 0).subtract(selfPos);
      let angle = v2(this._moveDirection.x, this._moveDirection.y).angle(
        v2(a.x, a.y)
      );
      angle = angle > PI / 2 ? -(PI - angle) : angle;

      const x = v2(this._moveDirection.x, this._moveDirection.y).rotate(
        angle * 2
      );
      this._moveDirection = v3(x.x, x.y);
    }

    if (other === 'top') {
      const a = v3(selfPos.x + 1, selfPos.y, 0).subtract(selfPos);
      let angle = v2(this._moveDirection.x, this._moveDirection.y).angle(
        v2(a.x, a.y)
      );
      angle = angle > PI / 2 ? PI - angle : -angle;

      const x = v2(this._moveDirection.x, this._moveDirection.y).rotate(
        angle * 2
      );
      this._moveDirection = v3(x.x, x.y);
    }

    if (other === 'bottom') {
      const a = v3(selfPos.x + 1, selfPos.y, 0).subtract(selfPos);
      let angle = v2(this._moveDirection.x, this._moveDirection.y).angle(
        v2(a.x, a.y)
      );
      angle = angle > PI / 2 ? -(PI - angle) : angle;

      const x = v2(this._moveDirection.x, this._moveDirection.y).rotate(
        angle * 2
      );
      this._moveDirection = v3(x.x, x.y);
    }

    // 计算夹角

    // const a = contactPos.subtract(v2(selfPos.x, selfPos.y));
    // const _angle = a.angle(v2(selfPos.x, contactPos.y));
    // // 弹跳角度
    // const angle = (_angle * 180) / Math.PI;
    // // 构造一个碰撞点反弹的新单位向量
    // const newDir = v2(contactPos.x, contactPos.y + 1)
    //   .rotate(_angle)
    //   .normalize();

    // this._moveDirection = v3(newDir.x, newDir.y, 0);
    // console.log('当前方向向量：');

    // console.log(this._moveDirection);
  }
  update(deltaTime: number) {
    if (service.state.value !== 'moving') return;

    // const direction = service.state.context.direction;
    // this._moveDirection = direction
    const pos = new Vec3(
      this._moveDirection.x * this.speed * deltaTime,
      this._moveDirection.y * this.speed * deltaTime,
      0
    );

    const curPos = this.weapon.position;
    this.weapon.position = new Vec3(pos.x + curPos.x, pos.y + curPos.y, 0);
  }
}
