import React, { Component } from "react";
import { Provider } from "react-redux";
import logo from "./logo.svg";
import store from "./store";
import SimpleForm from "./SimpleForm";

const showResults = values => {
  console.log(values);
};

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Sapin with redux form</h1>
          </header>
          <SimpleForm onSubmit={showResults} />
        </div>
      </Provider>
    );
  }
}

export default App;
