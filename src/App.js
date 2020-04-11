import React from 'react';
import Header from './shared/Header/index';
import './App.scss';

function App(props) {
  const {sessionName} = props;
  return (
    <div className="app-component">
      <Header sessionName={sessionName}/>
      {props.children}
    </div>
  );
}

export default App;
