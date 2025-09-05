import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AddDevice from './AddDevice';
import Home from './Home';
      
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-device" element={<AddDevice />} />
      </Routes>
    </BrowserRouter>
   
  );
}

export default App;
