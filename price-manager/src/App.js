import './App.css';
import FileViewer from './pages/MainPage';
import logo from "./assets/logo_e.png"

function App() {
  return (
    <div className="App">
      <img src={logo} alt='logo_e_emotum' className='App-logo' style={{margin: "20px"}}/>
      <FileViewer />
    </div>
  );
}

export default App;
