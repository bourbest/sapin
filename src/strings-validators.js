import {isNil} from 'lodash'
import {Errors} from './common'

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
export const isEmail = ({value, config}) => {
  if (config.isEmptyValue(value)) return null
  return !EMAIL_REGEX.test(value) ? config.formatError(Errors.isEmail, {value}, config) : null
}

export const minLength = (minLength) => {
  return ({value, config}) => {
    let err = null
    if (!config.isEmptyValue(value) && value.length < minLength) {
      err = config.formatError(Errors.minLength, {value, minLength}, config)
    }
    return err
  }
}

export const maxLength = (maxLength) => {
  return ({value, config}) => {
    let err = null
    if (!config.isEmptyValue(value) && value.length > maxLength) {
      err = config.formatError(Errors.maxLength, {value, maxLength}, config)
    }
    return err
  }
}
