import './ProductPage.css';

function ProductPage({ data, onBuyClick }) {
  return (
    <div className="product-page container">
      {/* Hero Banner */}
      <section className="product-hero">
        <div className="media-container">
          <img src={data.imageSrc} alt={`${data.title} — Premium Sound Effects`} className="hero-image" onError={(e) => { e.target.src = '/banner.png' }} />
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
              <span className="meta-dot">·</span>
              <div className="rating">
                <span className="stars">★★★★★</span>
                <span className="rating-score">4.8</span>
                <span className="sales">(2.847 vendas)</span>
              </div>
            </div>
          </div>

          <div className="description">
            <p className="text-body intro">
              {data.descriptionIntro}
            </p>
            <p className="text-body body-text">
              {data.descriptionBody}
            </p>
          </div>
        </div>

        <div className="pricing-sidebar">
          <div className="pricing-card">
            <div className="pricing-badge">🔥 Mais vendido</div>

            <div className="pricing-top">
              <span className="price-label">Acesso Vitalício</span>
              <div className="price-amount">R$ {data.price}</div>
              <div className="price-per-use">pagamento único • sem mensalidade</div>
            </div>

            <button className="btn btn-primary buy-btn" onClick={onBuyClick}>
              🛒 Comprar Agora
            </button>

            <p className="pricing-guarantee">
              🔒 Pagamento 100% seguro
            </p>

            <hr className="pricing-divider" />

            <ul className="pricing-features">
              <li><span className="feat-check">✓</span> +150 arquivos WAV e MP3</li>
              <li><span className="feat-check">✓</span> Acesso a atualizações futuras</li>
              <li><span className="feat-check">✓</span> Licença comercial incluída</li>
              <li><span className="feat-check">✓</span> Download imediato</li>
              <li><span className="feat-check">✓</span> Suporte por e-mail</li>
            </ul>

            <div className="pricing-social-proof">
              <span className="proof-avatars">😊😊😊</span>
              <span className="proof-text">+2.800 clientes satisfeitos</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="dotted-divider" />

      {/* Reviews Section */}
      <section className="reviews-section section-gap">
        <div className="reviews-header">
          <h2 className="h2">Avaliações</h2>
          <div className="overall-rating">
            <span className="score">4.8</span>
            <span className="stars">★★★★★</span>
          </div>
        </div>

        <div className="reviews-grid">
          <div className="review-card">
            <div className="customer-info">
              <span className="name">Mariana Costa</span>
              <span className="date">14 de mar. de 2026</span>
            </div>
            <div className="stars">★★★★★</div>
            <p className="review-text">"Este pacote transformou completamente a experiência do meu aplicativo. Os sons são sutis, profissionais e se encaixam perfeitamente em interfaces modernas. Recomendo muito para qualquer designer ou desenvolvedor."</p>
          </div>

          <div className="review-card">
            <div className="customer-info">
              <span className="name">Rafael Almeida</span>
              <span className="date">9 de mar. de 2026</span>
            </div>
            <div className="stars">★★★★★</div>
            <p className="review-text">"João é um excelente designer de som. O pacote é muito bem organizado e fácil de implementar. Gostei especialmente da variedade de sons de notificação."</p>
          </div>

          <div className="review-card">
            <div className="customer-info">
              <span className="name">Camila Ferreira</span>
              <span className="date">4 de mar. de 2026</span>
            </div>
            <div className="stars">★★★★☆</div>
            <p className="review-text">"Ótimo conteúdo no geral. Alguns sons de erro poderiam ser um pouco mais suaves, mas a qualidade fundamental é excelente. Valeu cada centavo do investimento."</p>
          </div>

          <div className="review-card">
            <div className="customer-info">
              <span className="name">Thiago Mendes</span>
              <span className="date">27 de fev. de 2026</span>
            </div>
            <div className="stars">★★★★★</div>
            <p className="review-text">"Melhor pacote de efeitos sonoros de UI que já comprei. A progressão de tons e a consistência entre os diferentes alertas são perfeitas. Já estou usando em todos os meus projetos."</p>
          </div>
        </div>
      </section>

      <hr className="dotted-divider" />

      {/* Leave a Review */}
      <section className="leave-review-section section-gap">
        <div className="leave-review-card">
          <h3 className="h3">Deixe uma avaliação</h3>
          <p className="text-body subtitle">Compartilhe sua experiência com outros compradores.</p>
          
          <form className="review-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Seu nome</label>
              <input type="text" placeholder="Digite seu nome" required />
            </div>
            <div className="form-group">
              <label>Sua avaliação</label>
              <textarea placeholder="Compartilhe sua opinião sobre este produto..." rows="5" required></textarea>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary submit-review-btn">
                Enviar avaliação
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ProductPage;
