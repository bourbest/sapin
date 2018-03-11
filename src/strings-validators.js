import {isNil} from 'lodash'
import {Errors, isEmptyValue, err} from './common'

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
export const isEmail = (value) => {
  if (isEmptyValue(value)) return null
  return !EMAIL_REGEX.test(value) ? err(Errors.isEmail) : null
}

export const minLength = (minLength) => {
  return (value) => {
    if (isNil(value) || value.length < minLength) {
      return err(Errors.minLength, {minLength})
    }
    return null
  }
}

export const maxLength = (maxLength) => {
  return (value) => {
    if (!isNil(value) && value.length > maxLength) {
      return err(Errors.maxLength, {maxLength})
    }
    return null
  }
}

export const noTrim = () => true

