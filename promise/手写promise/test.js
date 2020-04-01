const Promise = require('./promise.js')

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