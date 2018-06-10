self.addEventListener('message', ({ data }) => {
  console.log('in worker: message received: ', data);
  self.postMessage("received: " + data + "; respond: "+ Math.random());
})