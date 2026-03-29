import './CheckoutPage.css';

function CheckoutPage({ data, onBackClick }) {
  return (
    <div className="checkout-page container">
      <button className="back-btn" onClick={onBackClick}>
        ← Voltar
      </button>

      <div className="checkout-grid">
        {/* Left Column: Form */}
        <div className="checkout-form-section">
          <div className="section-header">
            <h2 className="h2 form-title">Detalhes do Pagamento</h2>
            <p className="subtitle text-body">Preencha suas informações para finalizar a compra de forma segura.</p>
          </div>

          <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-row">
              <div className="form-group">
                <label>Nome completo</label>
                <input type="text" placeholder="João da Silva" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="joao@exemplo.com" required />
              </div>
            </div>

            <div className="form-group">
              <label>Método de pagamento</label>
              <select required defaultValue="">
                <option value="" disabled>Selecione uma opção</option>
                <option value="pix">Pix</option>
                <option value="cartao">Cartão de Crédito</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>

            <div className="form-group">
              <label>Endereço</label>
              <input type="text" placeholder="Rua das Flores, 123" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Cidade</label>
                <input type="text" placeholder="São Paulo" required />
              </div>
              <div className="form-group zip-group">
                <label>CEP</label>
                <input type="text" placeholder="00000-000" required />
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-summary-section">
          <div className="summary-card">
            <h3 className="h3 summary-title">Resumo do Pedido</h3>
            
            <div className="product-mini">
              <img src={data.imageSrc} alt={data.title} className="product-thumb" onError={(e) => { e.target.src = '/banner.png' }} />
              <div className="product-info-mini">
                <div className="product-name">{data.title}</div>
                <div className="product-access">Acesso vitalício</div>
              </div>
            </div>

            <hr className="summary-divider" />

            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">R$ {data.price}</span>
            </div>
            
            <div className="summary-row">
              <span className="summary-label">Taxas</span>
              <span className="summary-value">R$ 0,00</span>
            </div>

            <div className="summary-row total-row">
              <span className="summary-label">Total</span>
              <span className="summary-value">R$ {data.price}</span>
            </div>

            <button className="btn btn-primary buy-btn complete-checkout-btn">
              Finalizar Compra
            </button>

            <div className="secure-payment">
              <span className="secure-icon">🛡️</span>
              <span className="secure-text">Pagamento 100% seguro e criptografado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
