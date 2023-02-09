import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chatgpt from './pages/Chatgpt';
import './pages/home.css'
import './pages/chatgpt.css'
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Chatgpt />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
