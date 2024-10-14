
export const useState = (init) => {
	if (typeof init === 'function') {
		let data;
		let inited = false;
		const set = (val) => {
			if (!inited) {
				inited = true;
				data = init();
			}
			if (typeof val === 'function')
				return data = val(data);
			return data = val;
		};
		const get = () => {
			if (inited) return data;
			inited = true
			return data = init();
		};
		return [get, set];
	} else {
		return [
			() => init,
			(val) => {
				if (typeof val === 'function')
					return init = val(init);
				return init = val;
			}
		];
	}
}

/**
 * useStore
 * 创建一个复杂类型的状态
 */
export const useStore = (object) => {

}

/**
 * 托管一个脏函数的生命周期
 */
export const useEffect = (scope) => {

}

/**
 * 创建一个只会调用一次的函数
 */
export const useOnce = (f, canExpire = false) => {
	let result;
	let flag = false;
	const ret = (...args) => {
		if (flag) return result;
		return flag = true, result = f(...args);
	};
	if (!canExpire) return ret
	return [ret, () => flag = false]
}

/**
 * 创建一个防抖函数
 */
export const useDebounce = (f, delay = 500, maxTime = 5000) => {
	maxTime = maxTime < 1000 ? 1000 : maxTime
	let time = Date.now(), time2 = time
	let result
	return (...args) => {
		const now = Date.now()
		if (now - time > delay || now - time2 > maxTime) {
			result = f(...args)
			time2 = now
		}
		time = now
		return result
	}
}

/**
 * 创建一个限流函数
 */
export const useThrottle = (f, delay = 1000) => {
	let time = Date.now()
	let result
	return (...args) => {
		const now = Date.now();
		if (now - time > delay) {
			time = now
			return result = f(...args)
		} else {
			return result;
		}
	}
}

/**
 * 创建一个延时执行函数
 */
export const useDefered = (f, delay = 0) => {
	return (...args) => {
		return setTimeout(f, delay, ...args);
	};
}

/**
 * 返回一个迭代n的函数，当predicate返回为真的时候执行，否则返回上次执行的值
 */
export const useCount = (f, predicate = () => true) => {
	let count = 0;
	let ret;
	return (...args) => {
		const canDO = predicate(count++);
		if (canDO) ret = f(...args);
		return ret;
	};
}

/**
 * 使用一个函数作为数据源，返回一对取值函数，get时将会调用数据源函数，如果计算过该值则返回缓存
 * 为了减少不可预测的行为，该函数应当尽量选择为纯函数，或者是只读脏函数
 * @param expiresTime 过期时间 单位毫秒
 */
export const useCache = (sourceFunction, getKey, expiresTime) => {
	const map = new Map();
	const timeout = new Map();
	expiresTime || (expiresTime = Number.MAX_SAFE_INTEGER);
	const RANDOM_KEY = String(Math.random());
	const defaultGetKey = (...x) => String(x[0]) || RANDOM_KEY;
	const _getKey = getKey || defaultGetKey;
	return [
		(...args) => {
			// 获取缓存
			const key = _getKey(...args);
			if (map.has(key) && (Date.now() - timeout.get(key)) < expiresTime)
				return map.get(key);

			// 重新计算
			const newOne = sourceFunction(...args);
			if (newOne instanceof Promise) {
				newOne.then((val) => {
					map.set(key, val);
					timeout.set(key, Date.now());
				});
			} else {
				map.set(key, newOne);
				timeout.set(key, Date.now());
			}
			return newOne;
		},
		(key, val) => {
			map.set(key, val);
			timeout.set(key, Date.now());
			return val;
		},
		(key) => {
			if (typeof key === 'string') {
				map.delete(key);
				timeout.delete(key);
			} else {
				for (const _key of map.keys()) {
					if (_key.match(key))
						map.delete(_key);
				}
			}
		},
	];
}

/**
 * 使用是一个依赖数组
 */
export const useMemo = (factory) => {
	let memo;
	let arr = [Math.random()];
	return (depends, ...args) => {
		if (!Array.isArray(depends) || compareArray(depends, arr))
			return memo;
		else {
			arr = depends;
			return memo = factory(...args);
		}
	}
}
const compareArray = (a, b) => {
	if (a.length !== b.length)
		return false;
	for (let i = 0, len = a.length; i < len; ++i) {
		if (a[i] !== b[i])
			return false;
	}
	return true;
};

/**
 * 创建一个自主清除副作用的脏函数，该函数某次调用所产生的副作用将会在函数下一次调用时清除
 * @param effect 带有副作用的函数，该函数需要返回其值，并且附带一个清除该次调用产生的副作用的clear函数
 */
export const useClean = (effect) => {
	let prev;
	return (...args) => {
		if (prev) prev();
		const tmp = effect(...args);
		prev = tmp[1];
		return tmp[0];
	};
}

/**
 * 创建一个会修改其依赖参数的函数
 */
export const useMute = () => {

}

export const useAspect = () => {

}


// 直接在usestate上实现
// export const useProvide = () => {

// }

// export const useInject = () => {

// }

Object.getOwnPropertyNames
Object.getOwnPropertySymbols
Object.getOwnPropertyDescriptors