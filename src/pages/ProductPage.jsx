import { useState } from 'react';
import './ProductPage.css';

function ProductPage({ data, onBuyClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fallback if mediaItems is empty or not created yet
  const mediaItems = data.mediaItems?.length > 0 
    ? data.mediaItems 
    : [{ type: 'image', url: data.imageSrc || '/banner.png' }];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mediaItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  return (
    <div className="product-page container animate-bounce-in">
      {/* Media Carousel */}
      <section className="product-hero">
        <div className="media-container carousel-container">
          {mediaItems.length > 1 && (
            <>
              <button className="carousel-btn prev-btn" onClick={prevSlide} aria-label="Anterior">←</button>
              <button className="carousel-btn next-btn" onClick={nextSlide} aria-label="Próximo">→</button>
            </>
          )}
          
          <div 
            className="carousel-track" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {mediaItems.map((item, index) => (
              <div key={index} className="carousel-slide">
                {item.type === 'video' ? (
                  item.url.includes('youtube') || item.url.includes('youtu.be') ? (
                    <iframe
                      src={item.url.includes('?') ? `${item.url}&autoplay=0` : `${item.url}?autoplay=0`}
                      title="Video preview"
                      frameBorder="0"
                      allowFullScreen
                      className="hero-iframe"
                    />
                  ) : (
                    <video src={item.url} controls className="hero-video" />
                  )
                ) : (
                  <img src={item.url} alt={`${data.title} preview`} className="hero-image" onError={(e) => { e.target.src = '/banner.png' }} />
                )}
              </div>
            ))}
          </div>

          {/* Indicators */}
          {mediaItems.length > 1 && (
            <div className="carousel-indicators">
              {mediaItems.map((_, i) => (
                <button 
                  key={i} 
                  className={`indicator-dot ${i === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Ir para slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <hr className="dotted-divider" />

      {/* Product Info + Pricing */}
      <div className="product-main section-gap">
        <div className="product-details">
          <div className="product-header">
            <h1 className="h1">{data.title}</h1>
            <div className="product-meta">
              <span className="meta-icon">👤</span>
              <span className="author">{data.author}</span>
            </div>
          </div>

          <div className="description">
            <p className="text-body intro">
              {data.descriptionIntro}
            </p>
            <p className="text-body body-text" style={{ whiteSpace: 'pre-line' }}>
              {data.descriptionBody}
            </p>
          </div>
        </div>

        <div className="pricing-sidebar">
          <div className="pricing-card payhip-style-card">
            <div className="price-amount">R$ {data.price}</div>

            <button className="btn btn-primary buy-btn" onClick={onBuyClick}>
              Comprar agora
            </button>

            <button className="btn btn-outline buy-btn secondary" onClick={onBuyClick}>
              Adicionar ao carrinho
            </button>

            <p className="pricing-secure">
              🔒 Pagamento seguro via <strong>Mercado Pago</strong>
            </p>
          </div>
        </div>
      </div>

      <hr className="dotted-divider" />
    </div>
  );
}

export default ProductPage;
