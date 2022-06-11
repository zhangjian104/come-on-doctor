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
import { contactAndBounce, nodeMove } from '../util';
const { ccclass, property } = _decorator;

@ccclass('Ghost')
export class Ghost extends Component {
  _moveDirection: Vec3 = new Vec3();
  start() {
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
    this._moveDirection = contactAndBounce(contact, this._moveDirection);
  }
  update(t) {
    nodeMove(this._moveDirection, t, 20, this.node);
  }
}
