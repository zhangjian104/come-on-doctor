import { Vec2, Vec3 } from 'cc';

export function changeVector(v: Vec2 | Vec3) {
  let _v: Vec2 | Vec3;
  if (v instanceof Vec2) {
    _v = new Vec3(v.x, v.y, 0);
  } else {
    _v = new Vec2(v.x, v.y);
  }
  return _v;
}
