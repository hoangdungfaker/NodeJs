'use strict'

const _ = require('lodash')


const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el,1]))
}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] == null) {
            delete obj[key]
        }
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            removeUndefinedObject(obj[key])
        }
    })
    return obj;
}

const updateNestedObject = obj => {
    const final = {}
    Object.keys(obj || {}).forEach(k => {
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            const response = updateNestedObject(obj[k])
            Object.keys(response).forEach(a => {
                final[`${k}.${a}`] = response[a]
            })
        }
        else {
            final[k] = obj[k]
        }
    })
    return final
}
module.exports = {
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObject
}