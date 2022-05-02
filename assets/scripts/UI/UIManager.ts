import { _decorator, Component, Node } from 'cc';
import { ManagerBase } from '../framework/ManagerBase';
import { MessageType } from '../framework/Message';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends ManagerBase {
  static Instance: UIManager;

  onLoad() {
    super.onLoad();

    UIManager.Instance = this;
  }

  setMessageType() {
    return MessageType.TypeUI;
  }
}
