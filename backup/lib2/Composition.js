var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const PIPE = Symbol();
const VALUE = Symbol();
const CATCH = Symbol();
/**
 * 异步Pipe函子
 */
export class Compisition {
    constructor(f) {
        this[PIPE] = [f];
    }
    comp(f) {
        const tmp = new Compisition(f);
        for (let i = 0; i < this[PIPE].length; ++i) {
            tmp[PIPE].push(this[PIPE][i]);
        }
        return tmp;
    }
    pipe(f) {
        const tmp = new Compisition(this[PIPE][0]);
        for (let i = 1; i < this[PIPE].length; ++i) {
            tmp[PIPE].push(this[PIPE][i]);
        }
        tmp[PIPE].push(f);
        return tmp;
    }
    catch(f) {
        this[CATCH] = f;
        return this;
    }
    get value() {
        // @ts-ignore
        if (!this[VALUE])
            this[VALUE] = (data) => __awaiter(this, void 0, void 0, function* () {
                data = yield data;
                let ctx = {};
                for (const f of this[PIPE]) {
                    try {
                        data = yield f(data, ctx);
                    }
                    catch (error) {
                        if (this[CATCH])
                            return this[CATCH](error);
                        else
                            throw error;
                    }
                }
                return data;
            });
        return this[VALUE];
    }
}
