import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/public/Login';
import Builder from './pages/admin/Builder';
import FormDetail from './pages/admin/FormDetail';
import SumbitPage from './pages/public/SubmitPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/build/:formId" element={<Builder />} />
                <Route path="/forms/:formId" element={<FormDetail />} />
                <Route path="/form/:shareURL" element={<SumbitPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
