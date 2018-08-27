import {trim, isString, isNil} from 'lodash'

export const getString = (value) => {
  return isNil(value) ? null : value.toString()
}

export function getTrimmedString (value) {
  return isNil(value) ? null : trim(value.toString())
}

export const getNumber = (value) => {
  return isNil(value) ? null : Number(value)
}

export function getFriendlyNumber (value) {
  if (!isNil(value)) {
    if (isString(value)) {
      value = value.replace(',', '.')
    }
    value = Number(value)
  } else {
    value = null
  }

  return value
}

export const getDate = (value) => {
  return value ? new Date(value) : null
}

export const getBool = (value) => {
  if (value === true || value === 'true') return true
  if (value === false || value === 'false') return false
  return null
}
