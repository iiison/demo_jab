import React, { useContext, createContext } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Form from '../Form/Form'
import Input, {
  useHandleBlur,
  useHandleChange,
} from './TextInput'

const TestCtx = createContext()

describe('>> COMPONENT -- TextInput Tests', () => {
  const field = {
    id : 'test',
    value : 'some value'
  }
  
  describe('• HOOK - useHandleChange Tests', () => {
    it('checks if hook returns function', () => {
      const updateField = jest.fn()
      const handleChange = useHandleChange(updateField, field)

      expect(typeof handleChange).toBe('function')
    })

    it('handleChange triggers updateField when called', () => {
      const updateField = jest.fn()
      const handleChange = useHandleChange(updateField, field)
      const event = {
        persist : jest.fn(),
        target  : {
          value : 'some value'
        }
      }

      handleChange(event)
      expect(event.persist).toHaveBeenCalled()
      expect(updateField).toHaveBeenCalledWith({
        ...field,
        value : event.target.value
      })
    })

    it('handleChange changes `isPristine` field to "partial" if it is set to true', () => {
      const fieldCopy = {
        ...field,
        isPristine : true
      }
      const updateField = jest.fn()
      const handleChange = useHandleChange(updateField, fieldCopy)
      const event = {
        persist : jest.fn(),
        target  : {
          value : 'some value'
        }
      }

      handleChange(event)
      expect(updateField).toHaveBeenCalledWith({
        ...fieldCopy,
        value : event.target.value,
        isPristine : 'partial'
      })
    })

    it('handleChange calls userdefined onChange method from field', () => {
      const fieldCopy = {
        ...field,
        events : {
          onChange : jest.fn()
        }
      }
      const updateField = jest.fn()
      const handleChange = useHandleChange(updateField, fieldCopy)
      const event = {
        persist : jest.fn(),
        target  : {
          value : 'some value'
        }
      }

      handleChange(event)
      expect(fieldCopy.events.onChange).toHaveBeenCalledWith({
        ...fieldCopy,
        value : event.target.value
      })
    })
  })

  describe('• HOOK - useHandleBlur Tests', () => {
    it('checks if hook returns function', () => {
      const updateField = jest.fn()
      const validateField = jest.fn()

      const handleBlur = useHandleBlur(updateField, validateField, field)

      expect(typeof handleBlur).toBe('function')
    })

    it('handleBlur should not call updateField and validateField if isPristine set to true', () => {
      const fieldCopy = {
        ...field,
        isPristine : true
      }
      const updateField = jest.fn()
      const validateField = jest.fn()

      const handleBlur = useHandleBlur(updateField, validateField, fieldCopy)
      const event = {
        persist : jest.fn()
      }

      handleBlur(event)
      expect(event.persist).toHaveBeenCalled()
      expect(updateField).not.toHaveBeenCalled()
      expect(validateField).not.toHaveBeenCalled()
    })

    it ('triggers updateField and validateField function when isPristine is set to "partial"', () => {
      const fieldCopy = {
        ...field,
        isPristine : 'partial'
      }
      const updateField = jest.fn()
      const validateField = jest.fn()
      const handleBlur = useHandleBlur(updateField, validateField, fieldCopy)
      const event = {
        persist : jest.fn()
      }

      handleBlur(event)
      expect(event.persist).toHaveBeenCalled()
      expect(validateField).toHaveBeenCalledWith({
        ...fieldCopy,
        isPristine : false
      })
      expect(updateField).toHaveBeenCalledWith({
        ...fieldCopy,
        isPristine : false,
        error : undefined
      }, false)
    })

    it ('triggers updateField and validateField function when isPristine is set to false', () => {
      const fieldCopy = {
        ...field,
        isPristine : false
      }
      const updateField = jest.fn()
      const validateField = jest.fn()
      const handleBlur = useHandleBlur(updateField, validateField, fieldCopy)
      const event = {
        persist : jest.fn()
      }

      handleBlur(event)
      expect(event.persist).toHaveBeenCalled()
      expect(validateField).toHaveBeenCalledWith({
        ...fieldCopy,
        isPristine : false
      })
      expect(updateField).toHaveBeenCalledWith({
        ...fieldCopy,
        isPristine : false,
        error : undefined
      }, false)
    })

    it ('triggers userdefined onBlur function', () => {
      const fieldCopy = {
        ...field,
        events : {
          onBlur : jest.fn()
        }
      }
      const updateField = jest.fn()
      const validateField = jest.fn()
      const handleBlur = useHandleBlur(updateField, validateField, fieldCopy)
      const event = {
        persist : jest.fn()
      }

      handleBlur(event)
      expect(fieldCopy.events.onBlur).toHaveBeenCalledWith({ ...fieldCopy })
    })
  })

  describe('• Component - UI Tests', () => {
    it('renders the Input component snapshot', () => {
      const { container } = render(<Form><Input {...field} /></Form>)

      expect(container).toMatchSnapshot()
    })

    it ('triggers onChange on input field', () => {
      const fieldCopy = {
        ...field,
        placeholder : 'test',
        events : {
          onChange : jest.fn()
        }
      }
     
      const data = render(
        <Form>
          <Input {...fieldCopy} />
        </Form>
      )
      const input = data.getByPlaceholderText('test')

      fireEvent.change(input, { target : { value : 'test' }})

      expect(input.value).toEqual('test')
    })

    it ('triggers onBlur on input field', () => {
      const fieldCopy = {
        ...field,
        placeholder : 'test',
        events : {
          onBlur : jest.fn()
        }
      }
     
      const data = render(
        <Form>
          <Input {...fieldCopy} />
        </Form>
      )
      const input = data.getByPlaceholderText('test')

      input.focus()
      input.blur()

      expect(fieldCopy.events.onBlur).toHaveBeenCalled()
    })
  })
})
