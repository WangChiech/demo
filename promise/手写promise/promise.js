// https://juejin.im/post/6845166891061739528
class Promise {
    constructor(executor) {
        // 不能相信用户的输入，要做参数的校验
        if (typeof executor !== 'function') {
            throw new TypeError(`Promise resolve ${executor} is not a function`)
        }
        this.initValue()
        this.initBind()
        try {
            executor(this.resolve, this.reject)
        } catch(e) {
            this.reject(e)
        }
        
    }
    initBind() {
        this.resolve = this.resolve.bind(this)
        this.reject = this.reject.bind(this)
    }
    initValue() {
        this.value = null // 终值
        this.reason = null // 拒因
        this.state = Promise.PENDING // 状态
        this.onFulfilledCallbacks = [] // 成功回调
        this.onRejectedCallbacks = [] // 失败回调
    }
    resolve(value) {
        // 成功之后的一系列操作(状态的改变，成功回调的执行)
        if (this.state === Promise.PENDING) {
            this.state = Promise.FULFILLED
            this.value = value
            this.onFulfilledCallbacks.forEach((fn) => {
                fn(this.value)
            })
        }
    }
    reject(reason) {
        // 失败后的一系列操作(状态改变，失败回调的执行)
        if (this.state === Promise.PENDING) {
            this.state = Promise.REJECT
            this.reason = reason
            this.onRejectedCallbacks.forEach((fn) => {
                fn(this.reason)
            })
        }
    }
    then(onFulFilled, onRejected) {
        // 参数校验
        if (typeof onFulFilled !== 'function') {
            onFulFilled = function(value) {
                return value
            }
        }
        if (typeof onRejected !== 'function') {
            onRejected = function(reason) {
                throw reason
            }
        }
        // 实现练市调用，且改变了后面then的值，必须通过新的实例
        let promise2 = new Promise((resolve, reject) => {
            if (this.state === Promise.FULFILLED) {
                setTimeout(() => {
                    try {
                        const x = onFulFilled(this.value)
                        resolve(x)
                    } catch(e) {
                        reject(e)
                    }
                })
            }
            if (this.state === Promise.REJECT) {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason)
                        resolve(x)
                    } catch(e) {
                        reject(e)
                    }
                })
            }
            if (this.state === Promise.PENDING) {
                this.onFulfilledCallbacks.push((value) => {
                    setTimeout(() => {
                        try {
                            const x = onFulFilled(value)
                            resolve(x)
                        } catch(e) {
                            reject(e)
                        }
                    })
                })
                this.onRejectedCallbacks.push((reason) => {
                    setTimeout(() => {
                        try {
                            const x = onRejected(reason)
                            resolve(x)
                        } catch(e) {
                            reject(e)
                        }
                        
                    })
                })
            }
        })
        return promise2
        
    }
}
Promise.PENDING = 'pending'
Promise.FULFILLED = 'fulfilled'
Promise.REJECT = 'reject'
Promise.resolvePromise = function(promise2, x, resolve, reject) {

}

module.exports = Promise