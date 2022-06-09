import { _decorator, Component, Node, Animation, v2, Vec2, Vec3, v3 } from 'cc';
import { nodeMove } from '../util';
const { ccclass, property } = _decorator;

@ccclass('Ghost')
export class Ghost extends Component {
  dir: Vec3 = new Vec3();
  start() {
    /**
     * 设置随机运动
     * 检测与其他ghost的碰撞，如果靠近了就向相反方向运动
     * 运动的方向为两个ghost原点向量的相反方向
     */
    console.log('我是ghost');
    // 生成随机方向
    Vec3.random(this.dir);
  }
  update(t) {
    nodeMove(this.dir, t, 20, this.node);
  }
}
