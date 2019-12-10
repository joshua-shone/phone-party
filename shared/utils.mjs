export function waitForNSeconds(seconds) {
  return new Promise(resolve => setTimeout(resolve, 1000 * seconds));
}

export function randomInArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function waitForPageToBeVisible() {
  return new Promise(resolve => {
    if (document.visibilityState === 'visible') {
      resolve();
    } else {
      document.addEventListener('visibilitychange', function callback() {
        if (document.visibilityState === 'visible') {
          resolve();
          document.removeEventListener('visibilitychange', callback);
        }
      });
    }
  });
}

export function waitForKeypress(key) {
  return new Promise(resolve => {
    window.addEventListener('keypress', function handleKeypress(event) {
      if (event.key === key) {
        resolve(event);
        window.removeEventListener('keypress', handleKeypress);
      }
    });
  });
}

export function waitForWebsocketToConnect(websocket) {
  return new Promise((resolve, reject) => {
    if (websocket.readyState === websocket.OPEN) {
      resolve();
    } else if (websocket.readyState === websocket.CLOSING || websocket.readyState === websocket.CLOSED) {
      reject();
    } else {
      websocket.addEventListener('open',  resolve, {once: true});
      websocket.addEventListener('close', reject,  {once: true});
      websocket.addEventListener('error', reject,  {once: true});
    }
  });
}

export function waitForWebsocketToDisconnect(websocket) {
  return new Promise(resolve => {
    if (websocket.readyState === websocket.CLOSING || websocket.readyState === websocket.CLOSED) {
      resolve('websocket_disconnected');
    } else {
      websocket.addEventListener('close', () => resolve('websocket_disconnected'), {once: true});
      websocket.addEventListener('error', () => resolve('websocket_disconnected'), {once: true});
    }
  });
}

export function waitForRtcConnection(rtcConnection) {
  return new Promise((resolve, reject) => {
    if (rtcConnection.iceConnectionState === 'connected' || rtcConnection.iceConnectionState === 'completed') {
      resolve();
    } else if (rtcConnection.iceConnectionState === 'failed' || rtcConnection.iceConnectionState === 'closed') {
      reject('rtc_closed');
    } else {
      rtcConnection.addEventListener('iceconnectionstatechange', function callback(event) {
        if (rtcConnection.iceConnectionState === 'connected' || rtcConnection.iceConnectionState === 'completed') {
          resolve();
          rtcConnection.removeEventListener('iceconnectionstatechange', callback);
        } else if (rtcConnection.iceConnectionState === 'failed' || rtcConnection.iceConnectionState === 'closed') {
          reject('rtc_closed');
          rtcConnection.removeEventListener('iceconnectionstatechange', callback);
        }
      });
    }
  });
}

export function waitForRtcConnectionClose(rtcConnection) {
  return new Promise((resolve, reject) => {
    if (rtcConnection.connectionState === 'failed' || rtcConnection.connectionState === 'closed') {
      resolve();
    } else {
      rtcConnection.addEventListener('iceconnectionstatechange', function callback(event) {
        if (rtcConnection.iceConnectionState === 'failed' || rtcConnection.iceConnectionState === 'closed') {
          resolve();
          rtcConnection.removeEventListener('iceconnectionstatechange', callback);
        }
      });
    }
  });
}

export async function waitForDataChannelOpen(dataChannel) {
  if (dataChannel.readyState === 'open') {
    return;
  } else if (dataChannel.readyState === 'closing' || dataChannel.readyState === 'closed') {
    throw 'Data channel is closing or closed';
  } else {
    return new Promise((resolve, reject) => {
      dataChannel.addEventListener('open', resolve, {once: true});
      dataChannel.addEventListener('error', reject, {once: true});
      dataChannel.addEventListener('close', reject, {once: true});
    });
  }
}

export async function waitForDataChannelClose(channel) {
  if (channel.readyState === 'closing' || channel.readyState === 'closed') {
    return;
  } else {
    return new Promise(resolve => {
      channel.addEventListener('close', resolve, {once: true});
      channel.addEventListener('error', resolve, {once: true});
    });
  }
}

export async function getMessageFromDataChannelOrClose(channel) {
  if (channel.readyState === 'closing' || channel.readyState === 'closed') {
    return [null, true];
  } else {
    return new Promise(resolve => {
      channel.addEventListener('message', event => resolve([event.data, false]), {once: true});
      channel.addEventListener('close', () => resolve([null, true]), {once: true});
      channel.addEventListener('error', () => resolve([null, true]), {once: true});
    });
  }
}
