import './App.css';
import Header from './components/Header';
import Body from './components/Body';
import { BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Body />
      </BrowserRouter>
    </div>
  );
}

export default App;
