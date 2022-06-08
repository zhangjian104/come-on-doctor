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
  UITransform,
} from 'cc';
import { BroadcastRoom } from '../framework/BroadcastRoom';
import { getRandom } from '../util';
const { ccclass, property } = _decorator;

@ccclass('GhostManager')
export class GhostManager extends Component {
  restrictedRect: Rect;
  // 所有ghost实例
  ghostList: Node[];
  start() {
    const self = this;

    // ghost随机生成的位置被框在一个包围盒内
    // 包围盒为Wall-rect节点，ghost所有的原点都随机落在此盒内
    // height: 598.7;
    // width: 396.80000000000007;
    // x: 121.60000000000005;
    // y: 371.7013333333333;
    BroadcastRoom.subscribe('event.wall.rect', (rect) => {
      this.restrictedRect = rect;
    });

    // 通过uuid动态加载预制资源
    assetManager.loadAny(
      ['119d3105-e090-4ec5-8976-106626774890'],
      (err, prefab) => {
        // 生成固定数量的ghost
        this.spawnGhostByNum(5, prefab);
      }
    );
  }

  private spawnGhostByNum(num, prefab) {
    while (num) {
      if (this.spawnGhost(prefab)) num--;
    }
  }

  private spawnGhost(prefab) {
    const prefabInst = instantiate(prefab) as any;
    const randomTag = '' + Math.random();
    prefabInst.name = randomTag;

    prefabInst.active = false;
    // @ts-ignore
    this.node.addChild(prefabInst);
    const { x, y, width, height } = this.restrictedRect;
    // 生成一个包围盒内的随机坐标
    const randomPos = v3(getRandom(x, x + width), getRandom(y, y + height), 0);

    // 获取所有ghost实例
    prefabInst.setWorldPosition(randomPos);
    // 当前ghost实例的包围盒
    const curRect = prefabInst
      .getComponents(UITransform)[0]
      .getBoundingBoxToWorld();
    const isCoincide = this.isCoincide(curRect, prefabInst);
    if (isCoincide === false) {
      console.log(this.node.getChildByName(randomTag));
      this.node.getChildByName(randomTag).destroy();
      return false;
    }
    return (prefabInst.active = true);
  }
  // 判断包围盒是否重合
  private isCoincide(curRect, prefabInst) {
    const children = this.node.children;
    if (children.length < 1) return;
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node === prefabInst) continue;
      const rect = node.getComponents(UITransform)[0].getBoundingBoxToWorld();
      // 判断两个盒子是否重合
      if (this.rectCoincide(curRect, rect)) {
        return false;
      }
    }
  }

  private rectCoincide(rect1, rect2) {
    const w = Math.abs(rect1.x - rect2.x) + rect1.width < 2 * rect1.width;
    const h = Math.abs(rect1.y - rect2.y) + rect1.height < 2 * rect1.height;
    console.log('重合了');
    // 两者都为true则必然重合
    return w && h;
  }
}
