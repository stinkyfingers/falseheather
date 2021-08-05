import React from 'react';
import Calendar from '../components/Calendar';
import Music from '../components/Music';
import { Switch, Route } from 'react-router-dom';

import '../css/body.css';

const Body = () => {
  return (
    <div className='body'>
      <div className='pad' />
      <div className='content'>
        <Switch>
          <Route path='/music'>
            <Music />
          </Route>
          <Route path='/'>
            <Calendar />
          </Route>
        </Switch>
      </div>
      <div className='pad' />
    </div>
  );
}

export default Body;
