import React, { useContext, useEffect } from 'react'
import { PropTypes } from 'prop-types'

import { FormCtx } from '../Form/Form'
import styles from './styles.css'

function useHandleChange (updateField, field) {
  return (event) => {
    event.persist()

    const { value } = event.target
    const updatedField = {
      ...field,
      value,
      isPristine : false
    }

    updateField(updatedField)

    const { events : { onChange } } = field

    if (onChange && typeof onChange === 'function') {
      onChange(updatedField)
    }
  }
}

export default function Select(props) {
  const {
    data,
    addField,
    updateField
  } = useContext(FormCtx)

  useEffect(() => {
    addField({
      ...props,
      isPristine : true,
    })
  }, [])

  const { id } = props
  const field = data[id]
  const handleChange = useHandleChange(updateField, field)

  if (!field) {
    return <div />
  }

  const {
    value,
    label,
    options
  } = field

  return (
    <div className='margin-bottom-l col-12'>
      <div className='grid-middle'>
        <div className={`${styles.multiOptionLabel}`}>
          <label htmlFor={id} className='margin-right-s'>{label}: </label>
        </div>
        <div className={`grid col`}>
          <select className={`col-12 ${styles.select}`} id={id} onChange={handleChange} value={value}>
            <option value=''>Select...</option>
            {options.map(({value, name}) => (<option key={value} value={value}>{name}</option>))}
          </select>
        </div>
      </div>
    </div>
  )
}

Select.propTypes = {
  id                  : PropTypes.string.isRequired,
  name                : PropTypes.string,
  value               : PropTypes.array,
  label               : PropTypes.string,
  validate            : PropTypes.string,
  options             : PropTypes.array,
  placeholder         : PropTypes.string,
  displayName         : PropTypes.string,
  shouldValidateField : PropTypes.bool,
  events              : PropTypes.shape({
    onChange : PropTypes.func
  }),
}
