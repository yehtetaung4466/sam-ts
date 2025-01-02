import Message from '/opt/shared/enumns/message'
import Operation from '/opt/shared/enumns/operation'
export default function getMessage(key:string,type:Operation) {

    switch(type) {
        case Operation.CREATE:
            return key +' '+ Message.CREATE_SUCCESS
        case Operation.UPDATE:
            return key +' ' + Message.UPDATE_SUCCESS
        case Operation.DELETE:
            return key + ' ' + Message.DELETE_SUCCESS
        case Operation.GET:
            return key + ' ' + 'data'
        case Operation.NOT_FOUND:
            return key + ' ' + Message.NOT_FOUND
        default:
            throw new Error('Please provide valid operation')
    }

}