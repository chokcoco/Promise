/**
 * ES6 Promise 
 */
class Promise {

    /**
     * constructor 构造函数
     * @param {Functiuon} fn 
     */
    constructor(fn) {

        // pending, fulfilled, rejected
        this.state = 'pending';
        this.value = null;

        this.onFulfilled = null;
        this.onRejected = null;
        this.thenPromise = null;

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

        if (obj instanceof Promise) {

        } else {
            // state change
            this.state = 'fulfilled';
            this.value = obj;

        }

    }

    reject(obj) {

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

        this.onFulfilled = onFulfilled ? onFulfilled : null;
        this.onRejected = onRejected ? onRejected : null;

        if (this.state === 'fulfilled') {
            // Promise 只能使用异步调用方式
            setTimeout(() => {
                try {

                } catch (e) {

                }
            });
        } else if (this.state === 'rejected') {

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