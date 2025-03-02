// Type definitions for hubot
// Definitions by: nyanchu

declare module "hubot" {
  export interface Robot {
    listen(
      regex: RegExp,
      options: { [key: string]: any } | Function,
      callback?: (res: Response) => void
    ): void;
    hear(
      regex: RegExp,
      options: { [key: string]: any } | Function,
      callback?: (res: Response) => void
    ): void;
    respond(
      regex: RegExp,
      options: { [key: string]: any } | Function,
      callback?: (res: Response) => void
    ): void;
    send(user: string, ...string: string[]): void;
    reply(user: string, ...string: string[]): void;
  }
  
  export interface Response {
    match: [string, string, { index: number }, { input: string }];

    message: {
      room: {
        type: string,
        id: string
      }
    };

    send(...strings: string[]): void;
    emote(...strings: string[]): void;
    reply(...strings: string[]): void;
    topic(...strings: string[]): void;
    play(...strings: string[]): void;
    locked(...strings: string[]): void;
    random(items: any[]): any;
    finish(): void;
  }
}
