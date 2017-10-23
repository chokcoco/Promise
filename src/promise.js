/**
 * ES6 Promise 
 */
class Promise {
    /**
     * 最终的执行器
     * @param {*} promise 
     * @param {*} value 
     */
    static execute(promise, value) {
        if (!promise) {
            return;
        }

        if (value instanceof Promise) {
            // Promise 可以一直触发 then 的原因
            value.then(val => {
                Promise.execute(promise, val);
            }, e => {
                promise.reject(e);
            })
        } else {
            promise.resolve(value);
        }
    }

    /**
     * constructor 构造函数
     * @param {Functiuon} fn 
     */
    constructor(fn) {

        // pending, fulfilled, rejected
        this.state = 'pending';
        this.value = null;
        this.err = null;

        this.onFulfilled = null;
        this.onRejected = null;
        this.nextPromise = null;

        if (fn && typeof fn === 'function') {
            let resolve = this.resolve.bind(this);
            let reject = this.reject.bind(this);

            try {
                fn(resolve, reject);
            } catch (e) {
                this.reject(e);
            }
        }
    }

    resolve(obj) {
        // only pending -> resolve
        if (this.state !== 'pending') {
            return;
        }

        // 如果 resolve 的值是个 promise 对象
        if (obj instanceof Promise) {
            // 当前 promise 执行完，链式执行下一个 promise
            Promise.execute(this, obj);

        } else {
            // state change
            this.state = 'fulfilled';
            this.value = obj;

            // 已经没有 onFulfilled 事件通过 then 注册了，整个 Promise 流程结束
            if (!this.nextPromise) {
                return;
            }

            // 存在 onFulfilled 事件，异步触发 Promise
            // 注意，Promise 只能使用异步调用方式
            setTimeout(() => {
                try {
                    // 查询是否已经注册 onFulfilled 回调，如已注册，传入参数，调起执行
                    let value = this.onFulfilled ? this.onFulfilled(this.value) : this.value;

                    // 当前 promise 执行完，链式执行下一个 promise
                    Promise.execute(this.nextPromise, value);
                } catch (e) {
                    this.nextPromise.reject(e);
                }
            });
        }
    }

    reject(err) {
        if (this.state != 'pending') {
            return;
        }

        this.state = 'rejected';
        this.err = err;

        // 没有 then 函数了 
        if (!this.nextPromise) {
            return;
        }

        setTimeout(() => {
            // 如果注册了错误回调，则执行之，并把回调返回值传给下一个 promise
            if (this.onRejected) {

                try {
                    let value = this.onRejected(this.reason);

                    // 当前 promise 执行完，链式执行下一个 promise
                    Promise.execute(this.nextPromise, value);
                } catch (e) {
                    this.nextPromise.reject(e);
                }
            } else {
                // 没有注册错误回调，则错误冒泡，传给下一个promise
                this.nextPromise.reject(this.reason);
            }
        })
    }

    then(onFulfilled, onRejected) {
        // 每次调用 then 都会返回一个新创建的 promise 对象
        let nextPromise = new Promise();
        this.nextPromise = nextPromise;

        onFulfilled !== 'function' ? null : onFulfilled;
        onRejected !== 'function' ? null : onRejected;

        if (!onFulfilled && !onRejected) {
            return nextPromise;
        }

        // 给 resolve 和 reject 触发时调用
        this.onFulfilled = onFulfilled ? onFulfilled : null;
        this.onRejected = onRejected ? onRejected : null;

        // 此时，promise 状态可能仍未发生变化，注册事件在 fulfilled 和 rejected 之前
        if (this.state === 'fulfilled') {
            // Promise 只能使用异步调用方式
            setTimeout(() => {
                try {
                    // 查询是否已经注册 onFulfilled 回调，如已注册，传入参数，调起执行
                    let value = this.onFulfilled ? this.onFulfilled(this.value) : this.value;

                    // 当前 promise 执行完，链式执行下一个 promise
                    Promise.execute(nextPromise, value);
                } catch (e) {
                    this.nextPromise.reject(e);
                }
            });
        } else if (this.state === 'rejected') {
            // 如果注册了错误回调，则执行之，并把回调返回值传给下一个 promise
            if (this.onRejected) {

                try {
                    let value = this.onRejected(this.reason);

                    // 当前 promise 执行完，链式执行下一个 promise
                    Promise.execute(this.nextPromise, value);
                } catch (e) {
                    this.nextPromise.reject(e);
                }
            } else {
                // 没有注册错误回调，则错误冒泡，传给下一个promise
                this.nextPromise.reject(this.reason);
            }
        }

        return nextPromise;
    }

    /**
     * 接收一个 promise 对象的数组作为参数，当这个数组里的所有 promise 对象全部变为 resolve 或 reject 状态的时候，才会去调用 .then 方法
     * @param {Array} promiseObjArr 
     */
    all(promiseObjArr) {

    }
}