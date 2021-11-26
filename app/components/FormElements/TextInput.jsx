import React, { useContext, useEffect } from 'react'
import { PropTypes } from 'prop-types'

import { debounce } from '$UTILS'

import { FormCtx } from '../Form/Form'
import styles from './styles.css'



export function useHandleChange(updateField, field = {}) {
  return (event) => {
    event.persist()

    const { value } = event.target
    const {
      isPristine,
      events : { onChange } = {}
    } = field
    const updatedField = {
      ...field,
      value
    }

    if (isPristine === true) {
      updatedField.isPristine = 'partial'
    }

    updateField(updatedField)

    if (onChange && typeof onChange === 'function') {
      onChange(updatedField)
    }
  }
}

export function useHandleBlur(updateField, validateField, field = {}) {
  return (event) => {
    event.persist()

    const {
      isPristine,
      events : { onBlur } = {}
    } = field
    const updatedField = { ...field }

    if (isPristine === 'partial') {
      updatedField.isPristine = false
    }

    if (updatedField.isPristine === false) {
      const error = validateField(updatedField)

      updatedField.error = error
      updateField(updatedField, false)
    }

    if (onBlur && typeof onBlur === 'function') {
      onBlur(updatedField)
    }
  }
}

export default function Input(props) {
  const {
    data,
    addField,
    updateField,
    validateField
  } = useContext(FormCtx)

  const {
    id,
    events = {},
  } = props
  const {
    onChange, // eslint-disable-line
    onBlur,   // eslint-disable-line
    ...restEvents
  } = events
  const field = data[id] || {}
  const handleChange = useHandleChange(updateField, field)
  const handleBlur = useHandleBlur(updateField, validateField, field)

  useEffect(() => {
    const propsCopy = { ...props }
    const { events = {} } = propsCopy
    const debounceTime = 500

    if (events.onChange && typeof events.onChange === 'function') {
      events.onChange = debounce(events.onChange, debounceTime)
    }

    addField({
      ...propsCopy,
      isPristine : true,
      events
    })
  }, [])

  const {
    label,
    value,
    error,
    placeholder,
    type = 'text',
  } = field


  return (
    <div className='margin-bottom-l col-12'>
      <div className='grid-middle'>
        <label htmlFor={id} className={`relative col ${styles.label}`}>
          <div className='grid-middle'>
            {label && <span className={`t-capitalize ${styles.labelTitle}`}>{label}:</span>}
            <div className='col grid'>
              <input
                id={id}
                type={type}
                value={value}
                className={`col-12 ${styles.input}`}
                placeholder={placeholder}
                onChange={handleChange}
                onBlur={handleBlur}
                {...restEvents}
              />
              {error && <span className={`${styles.error}`}>{error}</span>}
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}

Input.propTypes = {
  id                  : PropTypes.string.isRequired,
  name                : PropTypes.string,
  value               : PropTypes.string,
  label               : PropTypes.string,
  validate            : PropTypes.string,
  placeholder         : PropTypes.string,
  displayName         : PropTypes.string,
  shouldValidateField : PropTypes.bool,
  type                : PropTypes.oneOf(['email', 'text', 'number', 'tel', 'password', 'textarea']),
  events              : PropTypes.shape({
    onBlur   : PropTypes.func,
    onChange : PropTypes.func
  }),
}

