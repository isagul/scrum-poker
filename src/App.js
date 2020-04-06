import React from 'react';
import Header from './shared/Header/index';
import './App.scss';

function App(props) {
  return (
    <div className="app-component">
      <Header />
      {props.children}
    </div>
  );
}

export default App;
