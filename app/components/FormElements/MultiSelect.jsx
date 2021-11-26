import React, { useContext, useEffect } from 'react'
import { PropTypes } from 'prop-types'

import { FormCtx } from '../Form/Form'
import styles from './styles.css'

function Options({ options, handleClick, field }) {
  const { value : allValues } = field

  return options.map(({value, name}) => {
    const isSelected = allValues.includes(value)

    return (
      <div 
        value={value}
        key={value}
        onClick={() => handleClick({ value, name, isSelected })}
        className={`t-capitalize col-12 ${styles.option} ${isSelected && styles.selectedOption}`}
      >{name}</div>
    )})
}

function selectedOptions({ value, handleClick }) {
  if (value.length === 0) {
    return <div className='grid'>Select....</div>
  }

  return(
    <div className='grid'>
      {value.map(item => (
        <div
          onClick={() => handleClick({ value : item })}
          className={`${styles.optionTag} grid-middle`}
          key={item}
        >{item}</div>
      ))}
    </div>
  )
}

function useHandleChange(updateField, field, addOption = true) {
  return ({ value, isSelected }) => {
    let updatedField = {
      ...field,
      isPristine : false
    }

    if (addOption === true) {
      if (isSelected === true) {
        return
      }

      updatedField.value = [...updatedField.value, value]
    } else {
      const valueCopy = [ ...field.value ]
      const valueIndex = valueCopy.indexOf(value)

      if (valueIndex > -1) {
        valueCopy.splice(valueIndex, 1)
      }

      updatedField.value = [...valueCopy]
    }
    
    updateField(updatedField)

    const { events : { onChange } } = field

    if (onChange && typeof onChange === 'function') {
      onChange(updatedField)
    }
  }
}

export default function MultiOption(props) {
  const {
    data,
    addField,
    updateField
  } = useContext(FormCtx)

  useEffect(() => {
    addField({
      ...props,
      isPristine : true,
      value : []
    })
  }, [])

  const { id } = props
  const field = data[id]
  const handleAddOption = useHandleChange(updateField, field, true)
  const handleRemoveOption = useHandleChange(updateField, field, false)

  if (!field) {
    return <div />
  }

  const {
    value,
    name,
    label,
    options,
  } = field

  return (
    <div className='margin-bottom-l col-12'>
      <div className='grid-middle'>
        <div className={`${styles.multiOptionLabel}`}>
          <label htmlFor={id} className='margin-right-s'>{label || name}: </label>
        </div>
        <div className={`grid col ${styles.multiOption}`}>
          <div className='col-12 grid' id={id}>
            <div className={`col-12 padded-s ${styles.multiOptionContent}`}>
              {selectedOptions({value, handleClick : handleRemoveOption})}
            </div>
            <div className={`col-12 ${styles.options}`}>
              <Options options={options} field={field} value={value} handleClick={handleAddOption} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

MultiOption.propTypes = {
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

