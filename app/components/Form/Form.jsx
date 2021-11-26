import React, { createContext } from 'react'
import { PropTypes } from 'prop-types'

import { useSetState } from '$UTILS/reactUtils'
import validations from './validationRules'

export const FormCtx = createContext({})

export function useFormCTXProvider() {
  const [data, setData] = useSetState()

  return {
    data,
    setData,
    FormCTXProvider : FormCtx.Provider,
  }
}

function validateRule({ id, value, displayName, ruleValue, ruleArgs, validation }) {
  if (validation) {
    const stringifiedValue = value.toString()
    const isRuleSatisfied = ( ruleValue !== 'required' && !stringifiedValue )
      ? true
      : validation.rule.apply(null, ruleArgs).test(value.toString())

    let error = ''

    if (!isRuleSatisfied) {
      error = validation.formatter.apply(null, [displayName || id, ...ruleArgs])

      return error
    }
  } else {
    throw `invalid validation rule: ${ruleValue}, please use an existing validation rule name or pass a custom function with same name through 'customRules' prop in Input: ${id}. Rule value should be an object with keys: 'rule' as an Regex and 'formatter' as a function, that formats the value.` // eslint-disable-line
  }

  return ''
}

export function validateField({
  id,
  value,
  validate,
  displayName,
  customRules = {}
}) {
  let error = ''
  const rules = validate ? validate.split('|') : ''

  if (rules.length > 0) {
    for (const rule of rules) {
      if (!rule) {
        continue
      }

      const ruleDetails = rule.split('-')
      const [ruleValue, ...ruleArgs] = ruleDetails
      const validation = validations[ruleValue] || customRules[ruleValue]

      try {
        error = validateRule({ id, value, displayName, ruleValue, ruleArgs, validation })

        if (error !== '') {
          break
        }
      } catch (invalidRuleError) {
        throw invalidRuleError
      }
    }
  }

  return error
}

export function useUpdateField(setData, isNewField) {
  return (field, shouldRunValidation = true) => {
    const { id, isPristine, error } = field
    let validationError = error

    if (id === undefined) {
      throw new Error(`Please pass id to ${JSON.stringify(field)}`)
    }

    const value = isNewField === true && field.value === undefined ? '' : field.value

    if (isNewField !== true && isPristine === false && shouldRunValidation === true) {
      validationError = validateField(field)
    }

    setData({
      [id] : {
        ...field,
        value,
        error : validationError
      }
    })

  }
}

export default function Form({ children }) {
  const {
    data,
    setData,
    FormCTXProvider
  } = useFormCTXProvider()
  const addField = useUpdateField(setData, true)
  const updateField = useUpdateField(setData, false)
  const value = {
    data,
    addField,
    updateField,
    validateField
  }

  return (
    <FormCTXProvider value={value}>
      <form action="" className='col-12 grid'>
        {children}
      </form>
    </FormCTXProvider>
  )
}

Form.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

