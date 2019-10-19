const { EventEmitter } = require('../event-emitter');
const emitter = new EventEmitter();

const mock1 = () => {
    console.log('Mock1');
};
const mock2 = () => {
    console.log('Mock2');
};

emitter.on('test', mock2);
emitter.prependOnceListener('test', mock1);
emitter.emit('test');