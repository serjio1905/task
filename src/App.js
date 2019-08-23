import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
// import { Helmet } from 'react-helmet';
// import Cookies from 'universal-cookie';
import Req from './pages/Req';
import ReqList from './pages/ReqList';

// const cookies = new Cookies();


function App() {
  return (
    <div className="App">
      <Switch>
        {/* <Route path="/req-list" component={Main} /> */}
        <Route path="/req/:id" component={Req} />
        <Route path="/req" component={Req} />
        <Route path="/list" component={ReqList} />
        <Route path="/" component={ReqList} />
      </Switch>
    </div>
  );
}

export default App;
