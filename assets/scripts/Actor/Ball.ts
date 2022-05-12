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
  Tween,
  tween,
  bezier,
} from 'cc';

import { ComponentBase } from '../framework/ComponentBase';
import { Message, MessageType } from '../framework/Message';
import { MessageCenter } from '../framework/MessageCenter';
import { ActorManager } from './ActorManager';
import { changeVector } from '../util';

import { service } from '../machine/weapon.machine';

const { ccclass, property } = _decorator;

@ccclass('Ball')
export class Ball extends ComponentBase {
  private ball: Node;
  private weapon: Node;
  private shadow: Node;
  t = 0;
  start() {
    const self = this;
    // 注册为ui的消息接受者
    ActorManager.Instance.registerReceiver(this);

    // 2S后激活小球
    service.send('ACTIVE');

    this.weapon = this.node;
    this.ball = this.node.getChildByName('ball');
    this.shadow = this.node.getChildByName('shadow');

    // console.log(this.weapon.worldPosition);
  }

  getBezierPos(t) {
    // 当前位置
    const curPos = v3(320, 569, 0);
    // 终点位置
    const final = v3(500, 900, 0);
    // 控制点位置
    const midPos = v3(200, 800, 0);
    // B(t) = (1-t)*(1-t)*P0 + 2*t*(1-t)*P1 + t*t*P2
    const pos = v3();
    pos.x =
      (1 - t) * (1 - t) * curPos.x +
      2 * t * (1 - t) * midPos.x +
      t * t * final.x;
    pos.y =
      (1 - t) * (1 - t) * curPos.y +
      2 * t * (1 - t) * midPos.y +
      t * t * final.y;
    return pos;
  }

  receiveMessage(msg: Message) {
    super.receiveMessage(msg);
  }

  update(deltaTime: number) {
    // 当前位置
    let curPos = v3(320, 569, 0);
    // 终点位置
    let final = v3(500, 900, 0);
    // 控制点位置
    let midPos = v3(200, 800, 0);
    if (this.t < 1) {
      const p = this.getBezierPos(this.t);
      this.ball.setWorldPosition(p);
      this.t += 0.01;
      let out; // 投影向量
      // 小球在地面的投影；相当于计算小球向量在路线向量的投影
      let temp = Vec3.clone(final);
      temp.subtract3f(curPos.x, curPos.y, curPos.z);
      let pro = v2(p.x, p.y);
      pro.project(v2(temp.x, temp.y));
      this.shadow.setWorldPosition(v3(pro.x, pro.y, 0));

      // 修正小球投影的方向
      // 暂不处理
    }else{
      this.shadow.active = false
    }

    // if (service.state.value === 'active') {
    //   this.ball.active = true;
    // }
    // console.log(deltaTime);
    // const final = v3(500,900,0)
    // const pos = this.ball.getWorldPosition()
    // this.ball.setWorldPosition(v3(++pos.x,pos.y,0))
    // 中垂线方程,(x1,y1) (x2,y2) 为已知两点
    // 中点坐标： (x1+x2)/2,(y1+y2)/2 ）
    // y=-(x1-x2)/(y1-y2)x+(y1+y2)/2+(x1-x2)/(y1-y2)*(x1+x2)/2
    // 二阶贝塞尔曲线
    // B(t) = (1-t)*(1-t)*P0 + 2*t*(1-t)*P1 + t*t*P2
  }
}
