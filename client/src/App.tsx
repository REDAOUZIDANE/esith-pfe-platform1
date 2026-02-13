import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PFEList from './components/pfe/PFEList';
import PFECreate from './components/pfe/PFECreate';
import CompanyList from './components/company/CompanyList';
import AlumniList from './components/alumni/AlumniList';
import AlumniCreate from './components/alumni/AlumniCreate';
import CompanyCreate from './components/company/CompanyCreate';
import Chat from './components/chat/Chat';
import './index.css';

const App = () => {
  console.log('App: Rendering component');
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/pfes" element={<Layout><PFEList /></Layout>} />
        <Route path="/pfes/new" element={<Layout><PFECreate /></Layout>} />
        <Route path="/companies" element={<Layout><CompanyList /></Layout>} />
        <Route path="/companies/new" element={<Layout><CompanyCreate /></Layout>} />
        <Route path="/alumni" element={<Layout><AlumniList /></Layout>} />
        <Route path="/alumni/new" element={<Layout><AlumniCreate /></Layout>} />
        <Route path="/chat" element={<Layout><Chat /></Layout>} />
      </Routes>
    </Router>
  );
};

export default App;
