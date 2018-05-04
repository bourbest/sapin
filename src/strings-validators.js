import {Errors} from './errors'
import {isEmptyValue} from './utils'

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
export const isEmail = ({value, config}) => {
  if (isEmptyValue(value)) return null
  return !EMAIL_REGEX.test(value) ? Errors.isEmail : null
}

export const minLength = (minLength) => {
  return ({value}) => {
    let err = null
    if (!isEmptyValue(value) && value.length < minLength) {
      err = {error: Errors.minLength, params: {value, minLength}}
    }
    return err
  }
}

export const maxLength = (maxLength) => {
  return ({value}) => {
    let err = null
    if (!isEmptyValue(value) && value.length > maxLength) {
      err = {error: Errors.maxLength, params: {value, maxLength}}
    }
    return err
  }
}
