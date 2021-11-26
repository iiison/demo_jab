import React  from 'react'

import { useSetState } from '$UTILS/reactUtils'
import { Form } from '$COMPONENTS'
import {
  Input,
  Select,
  Options,
  MultiOption,
} from '$COMPONENTS/FormElements'

import data from './data.json'
import styles from './styles.css'

function selectInputByType(type, inputData) {
  switch (type) {
    case 'text':
      return (
        <Input
          validate={inputData.validate}
          events={inputData.events}
          label={inputData.label}
          value={inputData.value}
          key={inputData.id}
          id={inputData.id}
        />
      )

    case 'multiselect':
      return (
        <MultiOption
          validate={inputData.validate}
          options={inputData.options}
          events={inputData.events}
          label={inputData.label}
          value={inputData.value}
          key={inputData.id}
          id={inputData.id}
          type='multi'
        />
      )

    case 'select':
      return (
        <Select
          validate={inputData.validate}
          options={inputData.options}
          events={inputData.events}
          label={inputData.label}
          value={inputData.value}
          key={inputData.id}
          id={inputData.id}
        />
      )

    case 'checkbox':
      return (
        <Options
          validate={inputData.validate}
          options={inputData.options}
          events={inputData.events}
          label={inputData.label}
          value={inputData.value}
          key={inputData.id}
          id={inputData.id}
          type='multi'
        />
      )



  }
}

function renderInputs(inputs, setFormValues) {
  return inputs.map(input => {
    const { type, required, label } = input
    const validate = `${required === true ? 'required' :  ''}`
    const events = {
      onChange : (field) => setFormValues(field)
    }
    const inputData = {
      ...input,
      validate,
      events,
      id : label
    }

    return selectInputByType(type, inputData)
  })
}

function useUpdateFormValues (data) {
  const [ formValues, setFormValues ] = useSetState(() => data.reduce((acc, { label }) => ({
    ...acc,
    [label] : ''
  }), {}))

  const updateFormFields = ({ value, id }) => setFormValues({ [id] : value })

  return [ formValues, updateFormFields ]
}

function FormPreview({ data }) {
  return Object.entries(data).map(([ key, value ]) => (
    <p
      key={key}
      className='col-12 margin-tb-l'
    >
      {key}: {Array.isArray(value) === true ? value.join(', ') : value}
    </p>
  ))
}

export default function LandingForm() {
  const [formValues, setFormValues] = useUpdateFormValues(data)

  return (
    <div className="grid">
      <h1 className={`col-12 t-center margin-tb-l ${styles.pageHeader}`}>Form Demo</h1>
      <div className="col-12 padded-l">
        <div className="grid">
          <div className="col-6 col_md-12 grid">
            <Form>
              {renderInputs(data, setFormValues)}
            </Form>
          </div>
          <div className="col-6 col_md-12">
            <div className='grid-center'>
              <div className={`col-10 padded-s ${styles.preview}`}>
                <div className={`grid`}>
                  <h2 className='t-center col-12 t-upper'>preview</h2>
                  <FormPreview data={formValues} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

