import React, { useContext, useEffect } from 'react'
import { PropTypes } from 'prop-types'

import { FormCtx } from '../Form/Form'

function renderOptions({ options, type, handleChange, value }) {
  const inputType = type === 'multi' ? 'checkbox' : 'radio'

  return options.map(({value : optionValue, name, id}) => (
    <label className='col-12 grid' htmlFor={id||name} key={name} >
      <input
        id={id||name} 
        type={inputType}
        value={optionValue}
        defaultChecked={Array.isArray(value) ? value.includes(optionValue) : optionValue === value }
        onChange={handleChange}
      />
      <span className='t-capitalize'>{name} </span>
    </label>
  ))
}

function useHandleChange(updateField, field) {
  return (event) => {
    const { target : { value, checked } } = event
    let newValue = value

    if (field.type === 'multi') {
      if (checked === true) {
        newValue = [...field.value, value]
      } else {
        const fieldValueCopy = [ ...field.value ]
        const valueIndex = fieldValueCopy.indexOf(value)

        fieldValueCopy.splice(valueIndex, 1)
        newValue = fieldValueCopy
      }
    }

    const updatedField = {
      ...field,
      value : newValue,
      isPristine : false
    }

    updateField(updatedField)

    const { events : { onChange } } = field

    if (onChange && typeof onChange === 'function') {
      onChange(updatedField)
    }
  }
}

export default function Options(props) {
  const {
    data,
    addField,
    updateField
  } = useContext(FormCtx)

  useEffect(() => {
    addField({
      ...props,
      isPristine : true,
      value : props.type === 'multi' ? props.value || [] : props.value || ''
    })
  }, [])


  const { id } = props
  const field = data[id]
  const handleChange = useHandleChange(updateField, field)

  if (!field) {
    return <div />
  }

  const {
    type,
    label,
    value,
    options
  } = field

  return (
    <div className='margin-bottom-l col-12'>
      <div className='grid-middle'>
        <p className='col-12'>{label}:</p>
        {renderOptions({ options, type, handleChange, value })}
      </div>
    </div>
  )
}

Options.propTypes = {
  id                  : PropTypes.string.isRequired,
  name                : PropTypes.string,
  value               : PropTypes.string,
  label               : PropTypes.string,
  validate            : PropTypes.string,
  displayName         : PropTypes.string,
  shouldValidateField : PropTypes.bool,
  type                : PropTypes.oneOf(['email', 'text', 'number', 'tel', 'password', 'textarea']),
  events              : PropTypes.shape({
    onBlur   : PropTypes.func,
    onChange : PropTypes.func
  }),
}

