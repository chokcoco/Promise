# Promise

使用 ES6 语法实现的 Promise 函数。

## Promises/A+ 规范 

[Promises/A+](https://promisesaplus.com/)

Promise 表示一个异步操作的最终结果，与之进行交互的方式主要是 then 方法，该方法注册了两个回调函数 resolve 及 reject，用于接收 promise 的最终值或者本 promise 不能执行的原因。

### Promise 的状态

一个 Promise 的当前状态必须为以下三种状态中的一种：

#### 等待态（Pending）

处于等待态时，可以迁移至执行态或拒绝态。

#### 执行态（Fulfilled）

处于执行态时，promise 不能迁移至其他任何状态，必须拥有一个不可变的终值。

#### 拒绝态（Rejected）

处于拒绝态时，不能迁移至其他任何状态，必须拥有一个不可变的据因。

> 注意 promsie 的状态，只能由 pending 到 fulfilled/rejected, 状态一旦修改就不能再改变。

### 术语名词解析

#### Promise

promise 是一个拥有 then 方法的对象或函数，其行为符合本规范；

#### thenable

是一个定义了 then 方法的对象或函数，文中译作“拥有 then 方法”；

#### 值（value）

指任何 JavaScript 的合法值（包括 undefined , thenable 和 promise）；

#### 异常（exception）

是使用 throw 语句抛出的一个值。

#### 据因（reason）

表示一个 promise 的拒绝原因。

### promise对象方法

+ then 方法

```
// onFulfilled 是用来接收promise成功的值
// onRejected 是用来接收promise失败的原因
promise.then(onFulfilled, onRejected)
```
> 注意：then方法是异步执行的

+ resolve(成功) onFulfilled 会被调用

+ reject(失败) onRejected 会被调用

+ promise.catch

+ promise.all

+ promise.race 

> promise.catch / promise.all / promise.race 非 promise/A+ 规范要求，通常为各个库函数各自补充添加


### 构造函数

```JavaScript
// Promise构造函数接收一个executor函数，executor函数执行完同步或异步操作后，调用它的两个参数resolve和reject
var promise = new Promise((resolve, reject) => {
  /*
    如果操作成功，调用resolve并传入value
    如果操作失败，调用reject并传入reason
  */

});
```
