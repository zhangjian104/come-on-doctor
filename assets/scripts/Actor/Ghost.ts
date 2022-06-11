import {
  _decorator,
  Component,
  Node,
  Animation,
  v2,
  Vec2,
  Vec3,
  v3,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
} from 'cc';
import { nodeMove } from '../util';
const { ccclass, property } = _decorator;

@ccclass('Ghost')
export class Ghost extends Component {
  _moveDirection: Vec3 = new Vec3();
  start() {
    /**
     * 设置随机运动
     * 检测与其他ghost的碰撞，如果靠近了就向相反方向运动
     * 运动的方向为两个ghost原点向量的相反方向
     */
    console.log('我是ghost');
    // 生成随机方向
    Vec3.random(this._moveDirection);

    // 监听碰撞事件
    let collider = this.getComponent(Collider2D);
    collider.on(Contact2DType.BEGIN_CONTACT, this.onEndContact, this);
  }
  onEndContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    // 当前小怪的坐标
    const selfPos = selfCollider.node.getWorldPosition();
    const other = otherCollider.node.name;
    
    const PI = Math.PI;

    // 分上下左右处理小怪的碰撞角度
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

    if (otherCollider.tag === 2) {
      console.log('小怪相撞了');
    }

  }
  update(t) {
    nodeMove(this._moveDirection, t, 20, this.node);
  }
}
