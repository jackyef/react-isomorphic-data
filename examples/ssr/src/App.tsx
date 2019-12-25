import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import Home from './Home';
import SuspenseRoute from './routes/SuspenseExample';

import './App.css';

const App = () => {
  return (
    <>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/suspense-example">Suspense Example</Link>
      </nav>
      <Switch>
        <Route path="/suspense-example" component={SuspenseRoute} />
        <Route exact={true} path="/" component={Home} />
      </Switch>
    </>
  );
};

export default App;
