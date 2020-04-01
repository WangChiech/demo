// 1. index.js 进行原生的Promise演示
// 2. promise.js 进行自定义的Promise演示
// 3. test.js 是对promise.js进行测试
// 4. 开发过程中结合promise/a+规范


new Promise((resolve, reject) => {
    resolve(1)
})
    .then(
        (value) => {
            return new Promise((resolve) => {
                resolve(1)
            })
        }, 
        (reason) => {
            console.log('reason', reason)
    })
    .then(
        (value) => {
            console.log('value', value)
        },
        (reason) => {
            console.log('reason', reason)
        }
    )