import { VALUE } from './TypeClass';
/**
 * 函数式中的封装思想，把数据封装到一个容器当中，避免直接接触裸数据，或者形成模拟复杂的数据结构
 */
export class Container {
    static of(data) { return new Container(data); }
    constructor(data) { this[VALUE] = data; }
    get value() { return this[VALUE]; }
    get debug() { return (console.log(this), this); }
}
export class Range extends Container {
    static of(...data) {
        return new Range(data);
    }
    constructor(args) {
        let [left, right] = args;
        if (typeof left !== 'number')
            left = 0;
        if (typeof right !== 'number')
            right = 0;
        super([left >= 0 ? left : 0, right >= 0 ? right : 0]);
    }
    *[Symbol.iterator]() {
        let [left, right] = this[VALUE];
        while (left < right) {
            yield left++;
        }
    }
    forEach(f) {
        for (const it of this) {
            f(it);
        }
    }
    get value() { return Array.from(this[VALUE]); }
    slice(start = 0, end = -1) {
    }
    step() {
        // 更换步长
        return;
    }
}
export const $r = Range.of;
