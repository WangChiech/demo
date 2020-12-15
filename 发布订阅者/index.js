// 观察者基于发布订阅
const Observer = (() => {
    // 防止消息队列暴露而篡改故将消息容器作为静态私有变量保存
    const _message = {}
    return {
        // 注册信息接口
        regist: function (type, fn) {
            // 如果此消息不存在则应该创建一个该消息类型
            if (typeof _message[type] === 'undefined') {
                // 将动作推入到该消息对应的动作执行队列中
                _message[type] = [fn]
                // 如果此消息存在
            } else {
                // 将动作方法推入到该消息对应的动作执行序列中
                _message[type].push(fn)
            }
        },
        // 发布信息接口
        fire: function (type, args) {
            // 如果该消息没有被注册，则返回
            if (!_message[type]) {
                return
            }
            // 定义消息信息
            const events = {
                type: type, // 消息类型
                args: args || {} // 消息携带数据
            }
            let len = _message[type].length // 消息动作长度
            // 遍历消息序列, i 消息类型
            for (let i = 0; i < len; i++) {
                // 一次执行注册的消息对应的动作序列
                _message[type][i].call(this, events)
            }
        },
        // 移除信息接口
        remove: function (type, fn) {
            // 如果消息队列存在
            if (_message[type] instanceof Array) {
                // 从最后一个消息动作遍历
                
                for (let i = _message[type].length - 1; i >= 0; i--) {
                    // 如果存在该动作则在消息序列中移除相应动作
                    _message[type][i] === fn && _message[type].splice(i, 1)
                }
            }
        }
    }
})()
Observer.regist('test', function (e) {
    console.log(e.type, e.args.msg)
})
Observer.regist('test', function (e) {
    console.log(e.type, e.args.msg)
})
Observer.regist('111', function (e) {
    console.log(e,111)
})
Observer.regist('111', function (e) {
    console.log(e,1111111)
})
Observer.fire('111')
// Observer.fire('test', { msg: '传递参数'})