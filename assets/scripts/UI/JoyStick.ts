import {
  _decorator,
  Component,
  Node,
  EventTarget,
  input,
  Input,
  EventTouch,
  v2,
  v3,
  Vec2,
  UITransform,
  Vec3,
} from 'cc';
import { ComponentBase } from '../framework/ComponentBase';
import { BroadcastRoom } from '../framework/BroadcastRoom';
const { ccclass, property } = _decorator;

@ccclass('JoyStick')
export class JoyStick extends ComponentBase {
  @property(Node)
  circle: Node = null!;

  private _pointA: Vec2 = v2();
  private _pointB: Vec2 = v2();
  private _radius: number = 0;

  start() {
    this.node.active = false;
    // 监听全局input事件
    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

    this._radius =
      this.node.getComponent(UITransform)!.width * 0.5 -
      this.circle.getComponent(UITransform)!.width * 0.5;
  }

  onEnable() {}
  private onTouchStart(event: EventTouch) {
    this.node.active = true;

    const pos = v2();
    event.getUILocation(pos);
    
    this.node.setWorldPosition(v3(pos.x, pos.y, 0));
    event.getLocation(this._pointA);
  }

  private onTouchMove(event: EventTouch) {
    event.getLocation(this._pointB);
    const offset: Vec2 = this._pointB.subtract(this._pointA);
    // 将向量限制在特定的长度
    //比如 this._radius = 85
    // v2(-1.0, -1.0).multiplyScalar(this._radius) 返回 Vec2 {x:-85,y:-85}
    // v2(1.0, 1.0).multiplyScalar(this._radius) 返回 Vec2 {x:85,y:85}
    const move = offset.clampf(
      v2(-1.0, -1.0).multiplyScalar(this._radius),
      v2(1.0, 1.0).multiplyScalar(this._radius)
    );

    const distance = move.length();

    const radian = v2(1, 0).signAngle(move);
    const offsetX = Math.cos(radian) * this._radius;
    const offsetY = Math.sin(radian) * this._radius;

    this.circle.setPosition(
      this._radius < distance ? v3(offsetX, offsetY, 0) : v3(move.x, move.y, 0)
    );

    BroadcastRoom.publish('squash.moving.direction', move.normalize());
  }

  private onTouchEnd(event: EventTouch) {
    this.circle.setPosition(Vec3.ZERO);
    BroadcastRoom.publish('squash.moved.direction', undefined);
    // 隐藏此组件
    this.node.active = false;
  }
}
