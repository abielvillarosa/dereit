import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './../Home'


const Router = () => (
  <Switch>
    <Route exact path='/dereit' component={Home}/>
  </Switch>
)
export default Router