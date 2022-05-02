
import { Message } from './Message';

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

 
@ccclass('ComponentBase')
export class ComponentBase extends Component {
    // 接收消息
    receiveMessage(message: Message){
        // console.log('ComponentBase receive message' + message);
    }
}

