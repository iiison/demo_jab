import React from 'react'
import { PropTypes } from 'prop-types'

import * as styles from './styles.css'

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className={`${styles.loader} grid-middle grid-center`}>
      {
        <div className='grid-center'>
          <div className={styles.loaderCont}>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
          <span className='col-12 grid-center t-capitalize'>{message}</span>
        </div>
      }
    </div>
  )
}

Loader.propTypes = {
  message: PropTypes.string,
  success: PropTypes.bool
}


export default Loader
