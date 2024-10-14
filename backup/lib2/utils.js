var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function pipeline(...functions) {
    return (data) => {
        for (let i = 0, len = functions.length; i < len; ++i) {
            data = functions[i](data);
        }
        return data;
    };
}
export function pipelineAsync(...functions) {
    return (data) => __awaiter(this, void 0, void 0, function* () {
        for (let f of functions) {
            data = yield f(data);
        }
        return data;
    });
}
export function compose(...functions) {
    return (data) => {
        for (let i = functions.length - 1; i >= 0; --i) {
            data = functions[i](data);
        }
        return data;
    };
}
export function curry(func) {
    return function curried(...args) {
        if (args.length >= func.length) {
            return func.apply(this, args);
        }
        else {
            return function (...args2) {
                return curried.apply(this, args.concat(args2));
            };
        }
    };
}
// export function curry(f: Function) {
// 	const len = f.length
// 	const arr: any[] = []
// 	const tmp = (...args: any[]) => {
// 		arr.push(...args)
// 		if (arr.length >= len)
// 			return f(...arr)
// 		else
// 			return tmp
// 	}
// 	return tmp
// }
