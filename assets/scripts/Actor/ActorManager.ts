import { _decorator, Component, Node } from 'cc';
import { ManagerBase } from '../framework/ManagerBase';
import { MessageType } from '../framework/Message';
const { ccclass, property } = _decorator;

@ccclass('ActorManager')
export class ActorManager extends ManagerBase {
  static Instance: ActorManager;

  onLoad() {
    super.onLoad();

    ActorManager.Instance = this;
  }

  setMessageType() {
    return MessageType.TypeActor;
  }
}
