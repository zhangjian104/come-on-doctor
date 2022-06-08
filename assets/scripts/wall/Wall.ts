import { _decorator, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;
import { BroadcastRoom } from '../framework/BroadcastRoom';

@ccclass('Wall')
export class Wall extends Component {
  start() {
    // 获取围墙的矩形坐标
    const rect = this.node.getChildByName('rect');
    const wallRect = rect.getComponents(UITransform)[0].getBoundingBoxToWorld();

    // 等ghost节点加载完成，因此用延时器
    this.scheduleOnce(function () {
      BroadcastRoom.publish('event.wall.rect', wallRect);
    }, 0);
  }
}
