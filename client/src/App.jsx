import './App.css'
import ChatPage from './component/ChatPage.jsx'
import HomePage from './component/HomePage.jsx'
import { Route , Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
