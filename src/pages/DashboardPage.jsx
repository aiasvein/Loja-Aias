import { useState, useRef } from 'react';
import './DashboardPage.css';

const EMOJI_LIST = [
  '🎵','🎶','🎧','🔊','🎙️','🎚️','🔔','🎼','🎹','🥁',
  '⚡','✨','🔥','💎','🚀','🌊','🎯','🏆','💡','🎨',
  '✅','❌','⭐','🌟','💫','🎉','🥳','👏','💪','🙌',
  '📦','📁','🗂️','📋','📝','🔒','🔑','⚙️','🛒','💰',
  '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🎁','🛍️',
];

const MAX_MEDIA = 10;

function DashboardPage({ data, onSave, onBackClick }) {
  const [formData, setFormData] = useState({
    ...data,
    mediaItems: data.mediaItems || [{ type: 'image', url: data.imageSrc || '/banner.png' }],
  });
  const [isSaved, setIsSaved] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null); // 'intro' | 'body'
  const [activeMediaTab, setActiveMediaTab] = useState(0);
  const introRef = useRef(null);
  const bodyRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const insertEmoji = (emoji, field) => {
    const ref = field === 'intro' ? introRef : bodyRef;
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const currentVal = formData[field === 'intro' ? 'descriptionIntro' : 'descriptionBody'];
    const newVal = currentVal.substring(0, start) + emoji + currentVal.substring(end);
    setFormData(prev => ({
      ...prev,
      [field === 'intro' ? 'descriptionIntro' : 'descriptionBody']: newVal,
    }));
    setIsSaved(false);
    setTimeout(() => {
      el.selectionStart = start + emoji.length;
      el.selectionEnd = start + emoji.length;
      el.focus();
    }, 10);
    setShowEmojiPicker(null);
  };

  // Media management
  const updateMedia = (index, key, value) => {
    setFormData(prev => {
      const items = [...prev.mediaItems];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, mediaItems: items };
    });
    setIsSaved(false);
  };

  const addMedia = () => {
    if (formData.mediaItems.length >= MAX_MEDIA) return;
    setFormData(prev => ({
      ...prev,
      mediaItems: [...prev.mediaItems, { type: 'image', url: '' }],
    }));
    setActiveMediaTab(formData.mediaItems.length);
  };

  const removeMedia = (index) => {
    setFormData(prev => {
      const items = prev.mediaItems.filter((_, i) => i !== index);
      return { ...prev, mediaItems: items.length > 0 ? items : [{ type: 'image', url: '' }] };
    });
    setActiveMediaTab(Math.max(0, index - 1));
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const saveData = {
      ...formData,
      imageSrc: formData.mediaItems[0]?.url || formData.imageSrc,
    };
    onSave(saveData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const currentMedia = formData.mediaItems[activeMediaTab];

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

            {/* ─── Informações Básicas ─── */}
            <div className="form-section-label">Informações Básicas</div>

            <div className="form-group">
              <label htmlFor="title">Título do Produto</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Preço (R$)</label>
                <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="author">Autor / Empresa</label>
                <input type="text" id="author" name="author" value={formData.author} onChange={handleChange} required />
              </div>
            </div>

            {/* ─── Mídia ─── */}
            <div className="form-section-label">
              Mídia
              <span className="media-count">{formData.mediaItems.length}/{MAX_MEDIA}</span>
            </div>

            {/* Tabs de mídia */}
            <div className="media-tabs-row">
              {formData.mediaItems.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  className={`media-tab ${activeMediaTab === i ? 'active' : ''}`}
                  onClick={() => setActiveMediaTab(i)}
                >
                  {item.type === 'video' ? '🎬' : '🖼️'} {i + 1}
                </button>
              ))}
              {formData.mediaItems.length < MAX_MEDIA && (
                <button type="button" className="media-tab add-tab" onClick={addMedia}>
                  + Adicionar
                </button>
              )}
            </div>

            {/* Editor do item ativo */}
            {currentMedia && (
              <div className="media-item-editor">
                <div className="media-type-toggle">
                  <button
                    type="button"
                    className={`type-btn ${currentMedia.type === 'image' ? 'active' : ''}`}
                    onClick={() => updateMedia(activeMediaTab, 'type', 'image')}
                  >
                    🖼️ Imagem
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${currentMedia.type === 'video' ? 'active' : ''}`}
                    onClick={() => updateMedia(activeMediaTab, 'type', 'video')}
                  >
                    🎬 Vídeo
                  </button>
                </div>

                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label>
                    {currentMedia.type === 'video' ? 'URL do Vídeo (YouTube embed, .mp4)' : 'URL da Imagem'}
                  </label>
                  <input
                    type="text"
                    value={currentMedia.url}
                    onChange={(e) => updateMedia(activeMediaTab, 'url', e.target.value)}
                    placeholder={currentMedia.type === 'video' ? 'https://www.youtube.com/embed/...' : 'https://... ou /arquivo.png'}
                  />
                </div>

                {/* Preview inline */}
                {currentMedia.url && (
                  <div className="media-inline-preview">
                    {currentMedia.type === 'video' ? (
                      currentMedia.url.includes('youtube') || currentMedia.url.includes('youtu.be') ? (
                        <iframe
                          src={currentMedia.url}
                          title="preview"
                          frameBorder="0"
                          allowFullScreen
                          className="media-preview-frame"
                        />
                      ) : (
                        <video src={currentMedia.url} controls className="media-preview-video" />
                      )
                    ) : (
                      <img
                        src={currentMedia.url}
                        alt="preview"
                        className="media-preview-img"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </div>
                )}

                {formData.mediaItems.length > 1 && (
                  <button
                    type="button"
                    className="remove-media-btn"
                    onClick={() => removeMedia(activeMediaTab)}
                  >
                    🗑️ Remover este item
                  </button>
                )}
              </div>
            )}

            {/* ─── Descrição ─── */}
            <div className="form-section-label">Descrição</div>

            <div className="form-group">
              <div className="desc-label-row">
                <label htmlFor="descriptionIntro">Introdução (Itálico)</label>
                <button
                  type="button"
                  className="emoji-trigger-btn"
                  onClick={() => setShowEmojiPicker(showEmojiPicker === 'intro' ? null : 'intro')}
                >
                  😊 Emoji
                </button>
              </div>
              {showEmojiPicker === 'intro' && (
                <div className="emoji-picker">
                  {EMOJI_LIST.map(em => (
                    <button key={em} type="button" className="emoji-btn" onClick={() => insertEmoji(em, 'intro')}>
                      {em}
                    </button>
                  ))}
                </div>
              )}
              <textarea
                ref={introRef}
                id="descriptionIntro"
                name="descriptionIntro"
                value={formData.descriptionIntro}
                onChange={handleChange}
                rows="3"
                placeholder="Uma frase de impacto sobre o produto..."
              />
            </div>

            <div className="form-group">
              <div className="desc-label-row">
                <label htmlFor="descriptionBody">Corpo Principal</label>
                <button
                  type="button"
                  className="emoji-trigger-btn"
                  onClick={() => setShowEmojiPicker(showEmojiPicker === 'body' ? null : 'body')}
                >
                  😊 Emoji
                </button>
              </div>
              {showEmojiPicker === 'body' && (
                <div className="emoji-picker">
                  {EMOJI_LIST.map(em => (
                    <button key={em} type="button" className="emoji-btn" onClick={() => insertEmoji(em, 'body')}>
                      {em}
                    </button>
                  ))}
                </div>
              )}
              <textarea
                ref={bodyRef}
                id="descriptionBody"
                name="descriptionBody"
                value={formData.descriptionBody}
                onChange={handleChange}
                rows="7"
                placeholder="Descrição completa do produto, funcionalidades, o que está incluído..."
              />
            </div>

            <div className="dashboard-actions">
              <button type="submit" className={`btn btn-primary save-btn ${isSaved ? 'btn-success' : ''}`}>
                {isSaved ? '✓ Salvo com sucesso!' : 'Salvar Alterações'}
              </button>
            </div>

          </form>
        </div>

        {/* Live Preview */}
        <div className="dashboard-preview-section">
          <div className="preview-card">
            <h3 className="h3 summary-title">Preview Resumido</h3>

            <div className="preview-image-container">
              {formData.mediaItems[0]?.type === 'video' ? (
                <div className="preview-video-badge">🎬 Vídeo</div>
              ) : (
                <img
                  src={formData.mediaItems[0]?.url || '/banner.png'}
                  alt="Preview"
                  className="preview-image"
                  onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Imagem'; }}
                />
              )}
            </div>

            {formData.mediaItems.length > 1 && (
              <div className="preview-media-dots">
                {formData.mediaItems.map((_, i) => (
                  <span key={i} className={`media-dot ${i === 0 ? 'active' : ''}`} />
                ))}
                <span className="preview-media-count">{formData.mediaItems.length} mídias</span>
              </div>
            )}

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
