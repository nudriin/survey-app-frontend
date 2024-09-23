import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/public/Login';
import Builder from './pages/admin/Builder';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/build/:formId" element={<Builder />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
