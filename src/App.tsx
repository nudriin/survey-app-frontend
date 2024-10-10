import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.css"
import Dashboard from "./pages/admin/Dashboard"
import Login from "./pages/public/Login"
import Builder from "./pages/admin/Builder"
import FormDetail from "./pages/admin/FormDetail"
import SumbitPage from "./pages/public/SubmitPage"
import PrivateRoute from "./components/PrivateRoute"
import SignRoute from "./components/SignRoute"
import FormEditResponse from "./pages/admin/FormEditResponse"
import SkmDashboard from "./pages/skm/admin/SkmDashboard"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/build/:formId" element={<Builder />} />
                    <Route path="/forms/:formId" element={<FormDetail />} />
                </Route>
                <Route element={<SignRoute />}>
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route path="/form/:shareURL" element={<SumbitPage />} />
                <Route
                    path="/form/edit/:shareURL/:detailId"
                    element={<FormEditResponse />}
                />

                <Route path="/skm/dashboard" element={<SkmDashboard />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
