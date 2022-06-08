import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  assetManager,
  v3,
  Rect,
  v2,
} from 'cc';
import { BroadcastRoom } from '../framework/BroadcastRoom';
import { getRandom } from '../util';
const { ccclass, property } = _decorator;

@ccclass('GhostManager')
export class GhostManager extends Component {
  restrictedRect: Rect;

  start() {
    const self = this;

    // ghost随机生成的位置被框在一个包围盒内
    // 包围盒为Wall-rect节点，ghost所有的原点都随机落在此盒内
    // height: 598.7;
    // width: 396.80000000000007;
    // x: 121.60000000000005;
    // y: 371.7013333333333;
    console.log('监听');

    BroadcastRoom.subscribe('event.wall.rect', (rect) => {
      console.log(rect);
      this.restrictedRect = rect;
    });

    // 通过uuid动态加载预制资源
    assetManager.loadAny(
      ['119d3105-e090-4ec5-8976-106626774890'],
      (err, prefab) => {
        this.spawnGhost(prefab);
        this.spawnGhost(prefab);
        this.spawnGhost(prefab);
        this.spawnGhost(prefab);
        this.spawnGhost(prefab);
        this.spawnGhost(prefab);
      }
    );
  }
  private spawnGhost(prefab) {
    const prefabInst = instantiate(prefab) as any;
    prefabInst.active = false;
    // @ts-ignore
    this.node.addChild(prefabInst);
    const { x, y, width, height } = this.restrictedRect;
    // 生成一个包围盒内的随机坐标
    const randomPos = v3(getRandom(x, x + width), getRandom(y, y + height), 0);

    // 获取所有ghost实例
    prefabInst.setWorldPosition(randomPos);
    console.log(randomPos);

    prefabInst.active = true;
  }
}
