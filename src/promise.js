/**
 * ES6 Promise 
 */
class Promise {
    /**
     * 链式调用执行器
     * @param {*} promise 
     * @param {*} value 
     */
    static execute(promise, value) {
        if (!promise) {
            return;
        }

        // resolve 的结果是一个 Promise 对象
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

        // 当前 Promise 的 value
        this.value = null;

        // 异常
        this.err = null;


        // resolve 的回调
        this.onFulfilled = null;
        // reject 的回调
        this.onRejected = null;
        // 链式回调
        this.nextPromise = null;

        if (fn && typeof fn === 'function') {

            // 定义 resolve 、reject
            let resolve = this.resolve.bind(this);
            let reject = this.reject.bind(this);

            // 考虑到执行 fn 的过程中有可能出错，所以我们用 try/catch 块给包起来，并且在出错后以 catch 到的值传入 reject 
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
                    // 这里 this.onFulfilled 需要注意，是通过 then 方法的 Promise.then(onFulfilled => {}, onRejected => {}) 获取
                    // 考虑下面的 then() 执行 resolve/reject时， onFulfilled/onRejected 可能被注册也可能还未注册
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
                    let value = this.onRejected(this.err);

                    // 当前 promise 执行完，链式执行下一个 promise
                    Promise.execute(this.nextPromise, value);
                } catch (e) {
                    this.nextPromise.reject(e);
                }
            } else {
                // 没有注册错误回调，则错误冒泡，传给下一个promise
                this.nextPromise.reject(this.err);
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
                    let value = this.onRejected(this.err);

                    // 当前 promise 执行完，链式执行下一个 promise
                    Promise.execute(this.nextPromise, value);
                } catch (e) {
                    this.nextPromise.reject(e);
                }
            } else {
                // 没有注册错误回调，则错误冒泡，传给下一个promise
                this.nextPromise.reject(this.err);
            }
        }

        return nextPromise;
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }
}

window.Promise = Promise;
// module.exports = Promise;