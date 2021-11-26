import React, { Suspense, lazy } from 'react'
import {
  Route,
  Switch
} from 'react-router-dom'

import { Loader } from '$COMPONENTS'

const LandingForm = lazy(() => import('$SCREENS/LandingForm/LandingForm'))

const routes = () => {
  return (
    <div className='app grid'>
      <div className='col'>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route path='/' component={LandingForm} exact />
          </Switch>
        </Suspense>
      </div>
    </div>
  )
}

export default routes

