import React, { useContext } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Form, {
  FormCtx,
  validateField,
  useUpdateField,
  useFormCTXProvider
} from './Form'

const TestComponent = () => {
  const { value } = useContext(FormCtx)

  return <div>value is: {value}</div>
}

describe('>> COMPONENT -- Form Tests', () => {
  describe('• HOOK - useFormCTXProvider Tests', () => {
    it('Check if `data` from returned values is an empty object', () => {
      const { result } = renderHook(() => useFormCTXProvider())
      const { data, setData } = result.current

      expect(data).toEqual({})
      expect(setData).toBeDefined();
    })

    it('Check if `setData` function sets value to the state `data`', () => {
      const { result } = renderHook(() => useFormCTXProvider())
      const { data, setData } = result.current

      expect(data).toEqual({})

      const newData = { a : 1 }

      act(() => setData(newData))

      expect(result.current.data).toEqual(newData)
    })

    it('Check if `FormCTXProvider` returns the right context value', () => {
      const { result } = renderHook(() => useFormCTXProvider())
      const { FormCTXProvider } = result.current
      const value = { value : 'value' }

      render(
        <FormCTXProvider value={value}>
          <TestComponent />
        </FormCTXProvider>
      )

      expect(screen.getByText(/^value is:/)).toHaveTextContent(`value is: ${value.value}`)
    })
  })

  describe('• HOOK - useUpdateField Tests', () => {
    const field = {
      id : 'test',
      value : 'some value'
    }
    it('Check if the hook returns a function', () => {
      const result = useUpdateField(() => {})

      expect(typeof result).toBe('function')
    })

    it('Check if the returned function calls the parent function setData function', () => {
      const setData = jest.fn()
      const updateField = useUpdateField(setData)

      updateField(field, false)

      expect(setData).toHaveBeenCalledWith({
        test : {
          ...field,
          error : undefined
        }
      })
    })

    it('Throws error if field doesn\'t have id property', () => {
      const fieldCopy = { ...field }

      delete fieldCopy.id

      const setData = jest.fn()
      const updateField = useUpdateField(setData)

      try {
        updateField(fieldCopy)
      } catch(err) {
        expect(err.message).toBe('Please pass id to {"value":"some value"}')
      }
    })

    it('sets field value to empty string if isNewField is true', () => {
      const fieldCopy = { ...field }

      delete fieldCopy.value

      const setData = jest.fn()
      const updateField = useUpdateField(setData, true)

      updateField(fieldCopy, false)

      expect(setData).toHaveBeenCalledWith({
        test : {
          ...field,
          error : undefined,
          value : ''
        }
      })
    })

    it('validates the field when isPristine is false', () => {
      const fieldCopy = { ...field }

      fieldCopy.value = 'some value'
      fieldCopy.isPristine = false
      fieldCopy.validate = 'required|email'

      const setData = jest.fn()
      const updateField = useUpdateField(setData, false)

      updateField(fieldCopy)
      expect(setData).toHaveBeenCalledWith({
        test : {
          ...fieldCopy,
          error : 'test is not valid email'
        }
      })
    })
  })

  describe('• Component Helper - validateField Tests', () => {
    const field = {
      id : 'test',
      value : 'some value'
    }

    it('throws error if invalid validation rule name is passed', () => {
      const fieldCopy = { ...field }
      
      fieldCopy.validate = 'wrong'

      try {
        validateField(fieldCopy)
      } catch (err) {
        expect(err).toBeDefined()
      }
    })

    it('returns empty string if no validation rule is passed', () => {
      const result = validateField(field)

      expect(result).toBe('')
    })

    it('returns empty string if validation rule passed validation', () => {
      const fieldCopy = { ...field }

      fieldCopy.validate = 'required'

      const result = validateField(fieldCopy)

      expect(result).toBe('')
    })

    it('returns error if validation rule fails', () => {
      const fieldCopy = { ...field }

      fieldCopy.value = 'email'

      const result = validateField(fieldCopy)

      expect(result).toBeDefined()
    })
  })

  describe('• Component - UI Tests', () => {
    it('renders the Form component snapshot', () => {
      const { container } = render(<Form><p>Nothing!</p></Form>)
      expect(container).toMatchSnapshot()
    })
  })
})

