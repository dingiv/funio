import { Container } from "./Container";
import { VALUE } from "./TypeClass";
/**
 * 函子
 */
export class Functor extends Container {
    constructor(data) { super(data); }
    static of(data) { return new Functor(data); }
    map(f) { return Functor.of(f(this[VALUE])); }
    flatMap(f) { return f(this[VALUE]); }
}
export const createFunctor = Functor.of;
// export class Monad<T> extends Functor<T> {
// 	static of<T>(data: T) { return new Monad(data) }
// 	map<R>(f: UF<T, R>) { return Monad.of(f(this[VALUE])) }
// 	flatMap<R extends Container<any>>(f: UF<T, R>): R {
// 		return f(this[VALUE])
// 	}
// }
/**
 * 用以表示一个可能为空的值
 */
export class Maybe extends Functor {
    static of(data) { return new Maybe(data); }
    map(f) {
        const val = this[VALUE];
        if (val === undefined || val === null)
            return this;
        return Maybe.of(f(this[VALUE]));
    }
    unwrap(data) {
        let val = this[VALUE];
        if (val === undefined || val === null)
            return data;
        else
            return val;
    }
}
const _map = (f, v) => {
    try {
        return Right.of(f(v));
    }
    catch (error) {
        return Left.of(error);
    }
};
export class Left extends Functor {
    static of(data) { return new Left(data); }
    map(f) { return this; }
    catch(f) { return _map(f, this[VALUE]); }
    throw(f) {
        try {
            return Left.of(f(this[VALUE]));
        }
        catch (error) {
            return Left.of(new Error('Either throw error'));
        }
    }
}
export class Right extends Functor {
    static of(data) { return new Right(data); }
    map(f) { return _map(f, this[VALUE]); }
    catch(f) { return this; }
}
export const Either = Right;
// 用于表示一个值为函数的容器
export class Apply extends Functor {
    static of(data) {
        if (typeof data === 'function')
            return new Apply(data);
        return new Functor(data);
    }
    constructor(data) { super(data); }
    apply(data) {
        return Functor.of(this[VALUE](data[VALUE]));
    }
}
export class Effect extends Apply {
    map(f) {
    }
}
export class Task {
}
export class Observer {
}
