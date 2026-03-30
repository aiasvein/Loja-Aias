import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';

const defaultProductData = {
  title: "Apple Ui SFX",
  author: "por João Silva",
  price: "89,00",
  imageSrc: "/banner.png",
  descriptionIntro: "Efeitos sonoros premium inspirados na interface da Apple para seus projetos digitais.",
  descriptionBody: "Este pacote abrangente inclui tudo o que você precisa para sonorizar suas interfaces com elegância e minimalismo. Desenvolvido com técnicas profissionais para garantir áudio nítido e imersivo, perfeito para aplicativos, sites e protótipos. Inclui mais de 150 arquivos de áudio de alta qualidade (WAV e MP3), categorizados por interações (cliques, notificações, alertas, transições) e acesso vitalício a futuras atualizações."
};

// Protected route: only accessible if logged in
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

function App() {
  const navigate = useNavigate();
  const [productData, setProductData] = useState(() => {
    const saved = localStorage.getItem('appleUiProductData');
    return saved ? JSON.parse(saved) : defaultProductData;
  });

  useEffect(() => {
    localStorage.setItem('appleUiProductData', JSON.stringify(productData));
  }, [productData]);

  const goToCheckout = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/checkout');
  };

  const goToProduct = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/');
  };

  return (
    <div className="app-container">
      <Header onLogoClick={goToProduct} />
      <main>
        <Routes>
          <Route path="/" element={<ProductPage data={productData} onBuyClick={goToCheckout} />} />
          <Route path="/checkout" element={<CheckoutPage data={productData} onBackClick={goToProduct} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage data={productData} onSave={setProductData} onBackClick={goToProduct} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
