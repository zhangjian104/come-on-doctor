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
  ghostFront: Node;
  ghostBack: Node;
  _moveDirection: Vec3 = new Vec3();

  start() {
    this.ghostFront = this.node.getChildByName('ghost_front');
    this.ghostBack = this.node.getChildByName('ghost_back');

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
  private changePlayerByDirection(lor, tob) {
    // 上左
    if (lor && tob) {
      this.ghostBack.setRotationFromEuler(0, 0, 0);
      this.ghostFront.active = false;
      this.ghostBack.active = true;
    }
    // 上右
    if (!lor && tob) {
      this.ghostBack.setRotationFromEuler(0, 180, 0);

      this.ghostFront.active = false;
      this.ghostBack.active = true;
    }
    // / 下左
    if (lor && !tob) {
      this.ghostFront.setRotationFromEuler(0, 0, 0);

      this.ghostFront.active = true;
      this.ghostBack.active = false;
    }
    //下右
    if (!lor && !tob) {
      this.ghostFront.setRotationFromEuler(0, 180, 0);

      this.ghostFront.active = true;
      this.ghostBack.active = false;
    }
  }

  update(t) {
    nodeMove(this._moveDirection, t, 20, this.node);
    // 根据上下左右改变主角的朝向
    const lor = this._moveDirection.x > 0;
    const tob = this._moveDirection.y > 0;
    this.changePlayerByDirection(lor, tob);
  }
}
