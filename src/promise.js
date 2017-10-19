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

        this.onFulfilled = null;
        this.onRejected = null;
        this.thenPromise = null;

        if(fn && typeof fn === 'function') {
            let res = this.resolve.bind(this);
            let rej = this.reject.bind(this);

            try {
                fn(res, rej);
            } catch(e) {
                this.reject(e);
            }
        }
    }

    resolve(obj) {
        // only pending -> resolve
        if(this.state !== 'pending') {
            return;
        }

        if(obj instanceof Promise) {
            
        } else {
            // state change
            this.state = 'fulfilled';


        }

    }

    reject(obj) {

    }

    then(onFulfilled, onRejected) {

    }

    /**
     * 接收一个 promise 对象的数组作为参数，当这个数组里的所有 promise 对象全部变为 resolve 或 reject 状态的时候，才会去调用 .then 方法
     * @param {Array} promiseObjArr 
     */
    all(promiseObjArr) {

    }
}