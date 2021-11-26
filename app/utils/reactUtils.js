import { useState } from 'react'

const useSetState = (initialState = {}) => {
  const [state, regularSetState] = useState(initialState);

  const setState = newState => {
    regularSetState(prevState => { 
      return {
      ...prevState,
        ...newState
    } });
  };

  return [state, setState];
};

export {
  useSetState
}
