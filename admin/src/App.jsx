import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Home from './Home/Home'
import Logins from './Components/Users/Login'
import { Toaster } from 'react-hot-toast';

function App() {
  const token = sessionStorage.getItem('token');
  return (
    <BrowserRouter>
      {token ? <Home /> : <Logins />}
      <Toaster/>
    </BrowserRouter>
  );
}

export default App;
