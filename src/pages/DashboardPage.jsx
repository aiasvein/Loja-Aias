import { useState } from 'react';
import './DashboardPage.css';

function DashboardPage({ data, onSave, onBackClick }) {
  const [formData, setFormData] = useState({ ...data });
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    
    // Reset save state after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="dashboard-page container">
      <div className="dashboard-header">
        <button className="back-btn" onClick={onBackClick}>
          ← Voltar para Loja
        </button>
        <h1 className="h2 form-title">Dashboard Produto</h1>
        <p className="subtitle text-body">Altere as informações públicas do seu produto em tempo real.</p>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-form-section">
          <form className="admin-form" onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label htmlFor="title">Título do Produto</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Preço (R$)</label>
                <input 
                  type="text" 
                  id="price" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="author">Autor / Empresa</label>
                <input 
                  type="text" 
                  id="author" 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="imageSrc">Link da Imagem Principal (URL local ou absoluta)</label>
              <input 
                type="text" 
                id="imageSrc" 
                name="imageSrc" 
                value={formData.imageSrc} 
                onChange={handleChange} 
                required 
              />
              <span className="helper-text">Padrão: /banner.png</span>
            </div>

            <div className="form-group">
              <label htmlFor="descriptionIntro">Descrição - Introdução (Itálico)</label>
              <textarea 
                id="descriptionIntro" 
                name="descriptionIntro" 
                value={formData.descriptionIntro} 
                onChange={handleChange} 
                rows="2"
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="descriptionBody">Descrição - Corpo Principal</label>
              <textarea 
                id="descriptionBody" 
                name="descriptionBody" 
                value={formData.descriptionBody} 
                onChange={handleChange} 
                rows="6"
                required 
              />
            </div>

            <div className="dashboard-actions">
              <button 
                type="submit" 
                className={`btn btn-primary save-btn ${isSaved ? 'btn-success' : ''}`}
              >
                {isSaved ? '✓ Salvo com sucesso!' : 'Salvar Alterações'}
              </button>
            </div>
            
          </form>
        </div>

        {/* Live Preview Sidebar */}
        <div className="dashboard-preview-section">
          <div className="preview-card">
            <h3 className="h3 summary-title">Preview Resumido</h3>
            
            <div className="preview-image-container">
               <img src={formData.imageSrc} alt="Preview do banner" className="preview-image" onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Imagem+Incorreta' }} />
            </div>
            
            <div className="preview-info">
              <h4 className="preview-title">{formData.title}</h4>
              <span className="preview-price">R$ {formData.price}</span>
            </div>
            
            <hr className="summary-divider" />
            
            <div className="preview-description">
               <p className="preview-intro">{formData.descriptionIntro}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
