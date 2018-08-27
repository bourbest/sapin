import {isArray} from 'lodash'
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

export const oneOf = (domain) => {
  if (!isArray(domain) || domain.length === 0) {
    throw new Error('Invalid domain array given to oneOf')
  }
  const domainSet = new Set(domain)
  return ({value}) => {
    let err = null
    if (!isEmptyValue(value) && !domainSet.has(value)) {
      err = {error: Errors.oneOf, params: {value, domain}}
    }
    return err
  }
}
