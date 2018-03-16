import {Errors} from './common'

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
export const isEmail = ({value, config}) => {
  if (config.isEmptyValue(value)) return null
  return !EMAIL_REGEX.test(value) ? Errors.isEmail : null
}

export const minLength = (minLength) => {
  return ({value, config}) => {
    let err = null
    if (!config.isEmptyValue(value) && value.length < minLength) {
      err = {error: Errors.minLength, params: {value, minLength}}
    }
    return err
  }
}

export const maxLength = (maxLength) => {
  return ({value, config}) => {
    let err = null
    if (!config.isEmptyValue(value) && value.length > maxLength) {
      err = {error: Errors.maxLength, params: {value, maxLength}}
    }
    return err
  }
}
