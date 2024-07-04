import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Access from './pages/access/Access';
import Home from './pages/dashboard/Home';
import WaterIntake from './pages/dashboard/WaterIntake';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">  
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<Access />} />
            <Route path='/dashboard/home' element={<Home />} />
            <Route path='/dashboard/addIntake' element={<WaterIntake />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
