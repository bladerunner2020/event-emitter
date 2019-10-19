const { EventEmitter } = require('../event-emitter');

describe('EventEmitter tests', () => {
    let emitter;
    beforeEach(() => {
        emitter = new EventEmitter();
    });

    it('should emit event', () => {
        const mock1 = jest.fn();
        const mock2 = jest.fn();
        emitter.on('test', mock1);
        emitter.addListener('test', mock2);
        emitter.emit('test', 1, 2, 3);
        expect(mock1).toBeCalledWith(1, 2, 3);
        expect(mock2).toBeCalledWith(1, 2, 3);
    });

    it('should throw error if no error listeners', () => {
        const err = new Error('some error');
        expect(() => emitter.emit('error')).toThrow('Error [ERR_UNHANDLED_ERROR]: Unhandled error. (\'undefined\')');
        expect(() => emitter.emit('error', 'hello')).toThrow('Error [ERR_UNHANDLED_ERROR]: Unhandled error. (\'hello\')');
        expect(() => emitter.emit('error', err)).toThrow(err);
        emitter.on('error', () => {});
        expect(() => emitter.emit('error')).not.toThrow();
    });

    it('should throw error if invalid listener', () => {
        expect(() => emitter.on('test')).toThrow(new TypeError('TypeError [ERR_INVALID_ARG_TYPE]: The "listener" argument must be of type Function. Received type undefined'));
        expect(() => emitter.on('test', 123)).toThrow(new TypeError('TypeError [ERR_INVALID_ARG_TYPE]: The "listener" argument must be of type Function. Received type number'));
    });

    it('should return evenNames()', () => {
        emitter.on('test1', () => {});
        emitter.on('test2', () => {});
        emitter.on('test1', () => {});  
        emitter.on('test3', () => {});    
        expect(emitter.eventNames()).toEqual(['test1', 'test2', 'test3']); 
    });

    it('should return listenerCount()', () => {
        emitter.on('test1', () => {});
        emitter.on('test2', () => {});
        emitter.on('test1', () => {});  
        emitter.on('test1', () => {});    
        expect(emitter.listenerCount()).toBe(0);
        expect(emitter.listenerCount('test1')).toBe(3);
        expect(emitter.listenerCount('test2')).toBe(1);
        expect(emitter.listenerCount('test3')).toBe(0);
    });

    it('should return listeners()', () => {
        const mock1 = jest.fn();
        const mock2 = jest.fn();
        const mock3 = jest.fn();
        const mock4 = jest.fn();

        emitter.on('test1', mock1);
        emitter.on('test2', mock2);
        emitter.on('test1', mock3);  
        emitter.on('test1', mock4);    
        expect(emitter.listeners()).toEqual([]);
        expect(emitter.listeners('test1')).toEqual([mock1, mock3, mock4]);
        expect(emitter.listeners('test2')).toEqual([mock2]);
        expect(emitter.listeners('test3')).toEqual([]);
    });

    it('should remove listener', () => {
        const mock1 = jest.fn();
        const mock2 = jest.fn();
        emitter.on('test', mock2);
        emitter.on('test', mock2);
        emitter.on('test', mock1);
        emitter.emit('test');
        expect(mock2).toBeCalledTimes(2);
        expect(mock1).toBeCalledTimes(1);
        emitter.removeListener('test', mock1);
        emitter.emit('test');
        expect(mock2).toBeCalledTimes(4);
        expect(mock1).toBeCalledTimes(1);
        emitter.removeListener('test', mock2);
        emitter.emit('test');
        expect(mock2).toBeCalledTimes(5);
        expect(mock1).toBeCalledTimes(1);
        emitter.removeListener('test', mock2);
        expect(mock2).toBeCalledTimes(5);
        expect(mock1).toBeCalledTimes(1);
    });

    it('once should be called once', () => {
        const mock = jest.fn();
        emitter.once('test', mock);
        emitter.emit('test');
        expect(mock).toBeCalledTimes(1);
        emitter.emit('test');
        expect(mock).toBeCalledTimes(1);
    });

    it('listener added with prepandListener should be called before others', () => {
        const mock1 = jest.fn();
        const mock2 = jest.fn();
        emitter.on('test', mock1);
        emitter.prependListener('test', () => {
            expect(mock1).not.toBeCalled();
            mock2();
        });
        emitter.emit('test');
        expect(mock1).toBeCalled();
        expect(mock2).toBeCalled();
    });

    it('listener added with prependOnceListener should be called before others', () => {
        const mock1 = jest.fn();
        const mock2 = jest.fn();
        emitter.on('test', mock1);
        emitter.prependOnceListener('test', () => {
            expect(mock1).not.toBeCalled();
            mock2();
        });
        emitter.emit('test');
        expect(mock1).toBeCalled();
        expect(mock2).toBeCalled();
        emitter.emit('test');
        expect(mock1).toBeCalledTimes(2);
        expect(mock2).toBeCalledTimes(1);
    });

});