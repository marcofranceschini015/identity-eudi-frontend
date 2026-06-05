import { Navigate, Route, Routes } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import HomePage from './pages/HomePage';
import BankLoanFormPage from './pages/BankLoanFormPage';
import VerifyPage from './pages/VerifyPage';
import SuccessPage from './pages/SuccessPage';
import RentACarPage from './pages/RentACarPage';

export default function App() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bank-loan" element={<BankLoanFormPage />} />
          <Route path="/bank-loan/verify" element={<VerifyPage />} />
          <Route path="/bank-loan/success" element={<SuccessPage />} />
          <Route path="/rent-a-car" element={<RentACarPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}
