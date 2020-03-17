// 异步编程解决方案： 1.callback 2.generouter 3.promise 4.async+await
// promise 核心有状态、准备状态、解决状态、拒绝状态，最后根据状态改变里面的值
class HD{
    static PENDING = 'pending'
    static FUFILLED = 'fulfilled'
    static REJECTED = 'rejected'
    constructor(executor) {
        this.status = HD.FUFILLED
        this.value = null
        try {
            executor(this.resolve.bind(this),this.reject.bind(this))
        } catch (error) {
            this.reject(error)
        }
        
    }
    resolve(value) {
        if (this.status === HD.PENDING) {
            this.status = HD.FUFILLED
            this.value = value
        }
    }
    reject(reason) {
        if (this.status === HD.REJECTED) {
            this.status = HD.REJECTED
            this.value = reason
        }
        
    }
    then(onFulfilled, onRejected) {
        if (typeof onFulfilled !== "function") {
            onFulfilled = () => {}
        }
        if (typeof onRejected !== "function") {
            onRejected = () => {}
        }
        if (this.status === HD.FUFILLED) {
            onFulfilled(this.value)
        }
        if (this.status === HD.REJECTED) {
            onRejected(this.value)
        }
    }
}