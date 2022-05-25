import {
  _decorator,
  Node,
  Vec3,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
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
    });

    // 监听碰撞事件
    let collider = this.getComponent(Collider2D);
    console.log(collider);

    collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }
  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    console.log('小球发生碰撞');
    console.log(otherCollider);
    console.log(contact);
    const worldManifold = contact.getWorldManifold();
    const points = worldManifold.points;
    const normal = worldManifold.normal;
    console.log(points);
    console.log(normal);
  }
  update(deltaTime: number) {
    if (service.state.value !== 'moving') return;

    const direction = service.state.context.direction;

    const pos = new Vec3(
      direction.x * this.speed * deltaTime,
      direction.y * this.speed * deltaTime,
      0
    );

    const curPos = this.weapon.position;
    this.weapon.position = new Vec3(pos.x + curPos.x, pos.y + curPos.y, 0);
  }
}
