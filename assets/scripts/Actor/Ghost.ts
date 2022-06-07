import { _decorator, Component, Node, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Ghost')
export class Ghost extends Component {
  start() {
    /**
     * 设置随机运动
     * 检测与其他ghost的碰撞，如果靠近了就向相反方向运动
     * 运动的方向为两个ghost原点向量的相反方向
     */
  }
}
