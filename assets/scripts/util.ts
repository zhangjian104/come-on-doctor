import { Collider2D, v2, v3, Vec2, Vec3 } from 'cc';

export function changeVector(v: Vec2 | Vec3) {
  let _v: Vec2 | Vec3;
  if (v instanceof Vec2) {
    _v = new Vec3(v.x, v.y, 0);
  } else {
    _v = new Vec2(v.x, v.y);
  }
  return _v;
}

// 在范围内生成随机数
export function getRandom(n, m) {
  var num = Math.floor(Math.random() * (m - n + 1) + n);
  return num;
}

/**
 * 节点匀速移动
 * @param normalVec 方向向量
 * @param t 帧间隔，update方法第一个参数
 * @param speed 自定义速度
 * @param node 当前操作的节点
 */
export function nodeMove(normalVec, t, speed, node) {
  const pos = new Vec3(normalVec.x * t * speed, normalVec.y * t * speed, 0);
  const curPos = node.worldPosition;
  node.setWorldPosition(v3(curPos.x + pos.x, curPos.y + pos.y, 0));
}

/**
 * 处理
 * @param contact
 * @param _moveDirection
 */
export function contactAndBounce(contact, _moveDirection) {
  let normal;
  const localNormal = contact.getManifold().localNormal;
  const { x, y } = localNormal;
  if ((x === -1 && y === -0) || (x === 1 && y === -0)) {
    normal = 'y';
  } else {
    normal = 'x';
  }

  if (normal === 'y') {
    _moveDirection = v3(-_moveDirection.x, _moveDirection.y, 0);
  }

  if (normal === 'x') {
    _moveDirection = v3(_moveDirection.x, -_moveDirection.y, 0);
  }

  return _moveDirection;
}
