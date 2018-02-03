import config from '../config';


class Socket {
  constructor() {
    this.isAlive = false;
    this.cmdlisteners = [];
    this.userCmdListeners = {};
    this.apiListeners = {};
    this.lastSendTime = Date.now();
  }

  init() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(`${config.server.protocol}://${config.server.host}:${config.server.port}`);
      this.ws.onopen = () => {
        console.log('Socket is opened!');
        this.isAlive = true;
        resolve(this.ws);
      };

      this.ws.onmessage = (message) => {
        let msgMeta = null;
        try {
          msgMeta = JSON.parse(message.data);
        } catch (err) {
          msgMeta = message.data;
          console.log('WS got none JSON message:', msgMeta);
        }

        if (msgMeta.type === 'cmd') {
          const commands = msgMeta.data;
          commands.forEach((cmd) => {
            
            this.cmdlisteners.forEach((listener) => {
              listener(cmd);
            });

            const userId = cmd.userId;
            if (userId)  {
              if (this.userCmdListeners[userId]) {
                this.userCmdListeners[userId].forEach((listener) => {
                  listener(cmd);
                });
              }
            }
            
          });
        } else if (msgMeta.type === 'api' && this.apiListeners[msgMeta.id]) {
          this.apiListeners[msgMeta.id](msgMeta.data);
          delete this.apiListeners[msgMeta.id];
        }
      };

      this.ws.onerror = (err) => {
        console.log('WS got error: ', err);
        this.isAlive = false;
      };
      this.ws.onclose = () => {
        console.log('WS is closed!');
        this.isAlive = false;
      };
    });
  }

  registerCallback(id, cb) {
    this.apiListeners[id] = cb;
    setTimeout(() => {
      delete this.apiListeners[id];
    }, 2000);
  }


  sendCMD(message) {
    const timeNow = Date.now();
    //console.log('Sending cmd: ', message, `${timeNow - this.lastSendTime} ms`)
    this.lastSendTime = timeNow;
    this.checkConnection()
      .then(() => {
        this.ws.send(message);
      });
  }

  sendAPI(msgMeta, cb) {
    this.checkConnection()
      .then(() => {
        this.ws.send(JSON.stringify(msgMeta));
      });
    if (cb) {
      this.registerCallback(msgMeta.id, cb);
    }
  }

  checkConnection() {
    return Promise.resolve()
      .then(() => {
        if (!this.isAlive) {
          return this.init();
        }
      });
  }
}

export default Socket;
