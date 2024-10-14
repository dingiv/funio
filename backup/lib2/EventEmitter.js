var _a;
const BUS_ID = Symbol('bus callback id');
const BUS_MAP = Symbol('bus map');
export class EventEmitter {
    constructor() {
        this[_a] = {};
    }
    /**
     * 监听一个事件/订阅一个频道
     */
    on(event, callback, busId) {
        if (!event)
            return;
        if (busId) {
            callback[BUS_ID] = busId;
        }
        if (event in this[BUS_MAP]) {
            for (let c of this[BUS_MAP][event]) {
                if (c === callback)
                    return;
                if (busId && c[BUS_ID] === callback[BUS_ID])
                    return;
            }
            this[BUS_MAP][event].push(callback);
        }
        else {
            this[BUS_MAP][event] = [callback];
        }
    }
    /**
     * 取消订阅一个频道，需要给定需要删除的callback，如果不指定callback，则所有该channel的callback都会被删除
     */
    off(event, callback) {
        if (event in this[BUS_MAP]) {
            let arr = this[BUS_MAP][event];
            if (callback === undefined) {
                arr.splice(0);
                return;
            }
            for (let i = 0; i < arr.length; ++i) {
                if (arr[i] === callback)
                    arr.splice(i, 1);
            }
        }
    }
    /**
     * 触发一个事件/发布一个频道的消息
     */
    emit(event, ...args) {
        if (event in this[BUS_MAP]) {
            for (let c of this[BUS_MAP][event]) {
                c(...args);
            }
        }
    }
}
_a = BUS_MAP;
