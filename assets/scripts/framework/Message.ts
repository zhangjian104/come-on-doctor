export class Message {
  // 目标：管理类/具体类 + 具体内容
  Command: string;
  Content: any;

  constructor(command, content) {
    this.Command = command;
    this.Content = content;
  }
}

// export class MessageType {
//   static TypeUI = 1;
//   static TypeActor = 2;

//   static UI_RefreshHp = 101;
//   static Actor_Squash_MoveStart = 201;
//   static Actor_Squash_MoveIng = 202;
//   static Actor_Squash_MoveEnd = 203;
// }
