import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  assetManager,
  v3,
} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GhostManager')
export class GhostManager extends Component {
  start() {
    const self = this;
    // 通过uuid动态加载预制资源
    assetManager.loadAny(
      ['119d3105-e090-4ec5-8976-106626774890'],
      (err, prefab) => {
        // @ts-ignore
        self.node.addChild(instantiate(prefab));
        // @ts-ignore
        self.node.addChild(instantiate(prefab));
        // @ts-ignore
        self.node.addChild(instantiate(prefab));

        // 获取所有ghost实例
        console.log(self.node.children);
        self.node.children[0].setWorldPosition(v3(300,700,0))
        self.node.children[1].setWorldPosition(v3(200,500,0))
        self.node.children[2].setWorldPosition(v3(400,900,0))
      }
    );
  }
}
