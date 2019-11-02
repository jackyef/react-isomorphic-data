import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import Home from './Home';

import './App.css';

const App = () => {
  return (
    <>
      <Switch>
        <Route path="/somewhere" render={() => {
          return <Link to="/">Go back</Link>
        }}/>
        <Route exact={true} path="/" component={Home} />
      </Switch>
    </>
  );
};

export default App;