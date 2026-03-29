import { useState, useEffect } from 'react';
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

function App() {
  const [currentPage, setCurrentPage] = useState('product');
  const [productData, setProductData] = useState(() => {
    const saved = localStorage.getItem('appleUiProductData');
    return saved ? JSON.parse(saved) : defaultProductData;
  });

  useEffect(() => {
    localStorage.setItem('appleUiProductData', JSON.stringify(productData));
  }, [productData]);

  const goToCheckout = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage('checkout');
  };
  
  const goToProduct = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage('product');
  };

  const goToDashboard = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage('dashboard');
  };

  return (
    <div className="app-container">
      <Header onDashboardClick={goToDashboard} onLogoClick={goToProduct} />
      <main>
        {currentPage === 'product' && <ProductPage data={productData} onBuyClick={goToCheckout} />}
        {currentPage === 'checkout' && <CheckoutPage data={productData} onBackClick={goToProduct} />}
        {currentPage === 'dashboard' && <DashboardPage data={productData} onSave={setProductData} onBackClick={goToProduct} />}
      </main>
    </div>
  );
}

export default App;
