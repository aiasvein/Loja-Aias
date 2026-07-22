import { useState, useRef, useEffect, useCallback } from 'react';
import './DashboardPage.css';
import { supabase } from '../lib/supabaseClient';

const EMOJI_LIST = [
  '🎵','🎶','🎧','🔊','🎙️','🎚️','🔔','🎼','🎹','🥁',
  '⚡','✨','🔥','💎','🚀','🌊','🎯','🏆','💡','🎨',
  '✅','❌','⭐','🌟','💫','🎉','🥳','👏','💪','🙌',
  '📦','📁','🗂️','📋','📝','🔒','🔑','⚙️','🛒','💰',
  '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🎁','🛍️',
];

const MAX_MEDIA = 10;

// ─── VSCO Tracker Component ───────────────────────────────
function VscoTracker() {
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchClicks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vsco_clicks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (!error) setClicks(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchClicks(); }, [fetchClicks]);

  const clearAll = async () => {
    if (!window.confirm('Tem certeza que quer apagar todos os registros?')) return;
    setClearing(true);
    await supabase.from('vsco_clicks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setClicks([]);
    setClearing(false);
  };

  const copyLink = () => {
    const link = `${window.location.origin}/vsco`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <div className="vsco-tracker-section">
      {/* Header */}
      <div className="tracker-header">
        <div>
          <h2 className="tracker-title">🎣 VSCO Tracker</h2>
          <p className="tracker-subtitle">
            {clicks.length} acesso{clicks.length !== 1 ? 's' : ''} registrado{clicks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="tracker-actions">
          <button className="tracker-btn tracker-btn--copy" onClick={copyLink}>
            {copied ? '✓ Copiado!' : '🔗 Copiar link'}
          </button>
          <button className="tracker-btn tracker-btn--refresh" onClick={fetchClicks} disabled={loading}>
            {loading ? '...' : '↺ Atualizar'}
          </button>
          <button className="tracker-btn tracker-btn--clear" onClick={clearAll} disabled={clearing}>
            {clearing ? 'Apagando...' : '🗑️ Limpar'}
          </button>
        </div>
      </div>

      {/* Link info */}
      <div className="tracker-link-box">
        <span className="tracker-link-label">🔗 Seu link de rastreamento:</span>
        <code className="tracker-link-url">{window.location.origin}/vsco</code>
      </div>

      {/* Table */}
      {loading ? (
        <div className="tracker-loading">Carregando registros...</div>
      ) : clicks.length === 0 ? (
        <div className="tracker-empty">
          <div className="tracker-empty-icon">📭</div>
          <p>Nenhum acesso ainda. Compartilhe o link e aguarde!</p>
        </div>
      ) : (
        <div className="tracker-table-wrapper">
          <table className="tracker-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Horário</th>
                <th>Cidade</th>
                <th>País</th>
                <th>ISP / Operadora</th>
                <th>Dispositivo</th>
                <th>Browser</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {clicks.map((c, i) => (
                <tr key={c.id}>
                  <td className="tracker-num">{clicks.length - i}</td>
                  <td className="tracker-date">{formatDate(c.created_at)}</td>
                  <td>
                    <span className="tracker-city">{c.city || '—'}</span>
                    {c.region && <span className="tracker-region">, {c.region}</span>}
                  </td>
                  <td>{c.country || '—'}</td>
                  <td className="tracker-isp">{c.isp || '—'}</td>
                  <td>
                    <span className={`tracker-device tracker-device--${(c.device || 'desktop').toLowerCase()}`}>
                      {c.device === 'Mobile' ? '📱' : c.device === 'Tablet' ? '📟' : '💻'} {c.device}
                    </span>
                  </td>
                  <td>{c.browser || '—'}</td>
                  <td className="tracker-ip">{c.ip || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Main ────────────────────────────────────────
function DashboardPage({ data, onSave, onBackClick }) {
  const [formData, setFormData] = useState({
    ...data,
    mediaItems: data.mediaItems || [{ type: 'image', url: data.imageSrc || '/banner.png' }],
  });
  const [isSaved, setIsSaved] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null); // 'intro' | 'body'
  const [activeTab, setActiveTab] = useState('produto'); // 'produto' | 'tracker'
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Small warning just in case
    if (file.type.startsWith('video/') && file.size > 50 * 1024 * 1024) {
      alert('Aviso: Vídeos muito grandes podem exceder o limite de memória do navegador. Se isso acontecer, use um link do YouTube.');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateMedia(activeMediaTab, 'url', reader.result);
      if (file.type.startsWith('video/')) {
        updateMedia(activeMediaTab, 'type', 'video');
      } else {
        updateMedia(activeMediaTab, 'type', 'image');
      }
    };
    reader.readAsDataURL(file);
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
        <h1 className="h2 form-title">Dashboard</h1>
        <p className="subtitle text-body">Gerencie seu produto e veja quem acessou seu link VSCO.</p>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab ${activeTab === 'produto' ? 'active' : ''}`}
          onClick={() => setActiveTab('produto')}
        >
          🛍️ Produto
        </button>
        <button
          className={`dashboard-tab ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracker')}
        >
          🎣 VSCO Tracker
        </button>
      </div>

      {activeTab === 'tracker' && <VscoTracker />}

      {activeTab === 'produto' && <div className="dashboard-content">
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
                  <div className="upload-row">
                    <input
                      type="text"
                      className="media-url-input"
                      value={currentMedia.url}
                      onChange={(e) => updateMedia(activeMediaTab, 'url', e.target.value)}
                      placeholder={currentMedia.type === 'video' ? 'https://www.youtube.com/embed/...' : 'https://... ou /arquivo.png'}
                    />
                    <div className="upload-btn-wrapper">
                      <button type="button" className="btn btn-outline btn-upload">
                        📁 Do PC
                      </button>
                      <input 
                        type="file" 
                        accept="image/*,video/mp4,video/webm" 
                        onChange={handleFileUpload} 
                        title="Fazer upload de arquivo"
                      />
                    </div>
                  </div>
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
      </div>}
    </div>
  );
}

export default DashboardPage;
