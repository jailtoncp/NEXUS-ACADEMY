import React, { useRef, useState } from 'react';
import { Camera, Save, ShieldCheck, Target, Trash2, UserRound } from 'lucide-react';
import { getUserInitials, readUserProfile, saveUserProfile } from '../lib/userProfile.js';

function resizeProfilePhoto(file) {
  return new Promise((resolve, reject) => {
    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type.toLowerCase())) {
      reject(new Error('Escolha uma imagem JPG, PNG ou WebP.'));
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      reject(new Error('A foto precisa ter até 12 MB antes da compactação.'));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      try {
        const width = image.naturalWidth;
        const height = image.naturalHeight;
        if (!width || !height || width * height > 40_000_000) throw new Error('A imagem tem dimensões muito grandes para este navegador.');
        const scale = Math.min(1, 512 / Math.max(width, height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Não foi possível preparar a foto neste navegador.');
        context.fillStyle = '#0b121e';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Não foi possível abrir essa imagem. Tente JPG, PNG ou WebP.'));
    };
    image.src = objectUrl;
  });
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState(readUserProfile);
  const [message, setMessage] = useState(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const photoInputRef = useRef(null);

  function update(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
    setMessage(null);
  }

  async function choosePhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setPhotoBusy(true);
    setMessage(null);
    try {
      const photoDataUrl = await resizeProfilePhoto(file);
      setProfile((current) => ({ ...current, photoDataUrl }));
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Não foi possível preparar essa foto.' });
    } finally {
      setPhotoBusy(false);
    }
  }

  function save(event) {
    event.preventDefault();
    try {
      setProfile(saveUserProfile(profile));
      setMessage({ type: 'success', text: 'Perfil salvo neste dispositivo.' });
    } catch {
      setMessage({ type: 'error', text: 'Não foi possível salvar. O navegador pode estar sem espaço; tente remover a foto ou liberar armazenamento.' });
    }
  }

  return (
    <section className="profile-page">
      <div className="profile-page-heading">
        <span>PERSONALIZAÇÃO LOCAL</span>
        <h1>Meu perfil</h1>
        <p>Personalize seus dados de estudo. O perfil e a foto ficam no armazenamento local deste navegador, sem criptografia, e não são enviados a servidores do NEXUS. Evite registrar informações sensíveis.</p>
      </div>

      <div className="profile-page-layout">
        <form className="profile-editor-card" onSubmit={save}>
          <div className="profile-editor-heading"><div className="profile-editor-icon"><UserRound /></div><div><h2>Dados do estudante</h2><p>Os campos são opcionais; você pode alterá-los quando quiser.</p></div></div>

          <div className="profile-photo-editor">
            <div className="profile-photo-preview" aria-label="Prévia da foto de perfil">
              {profile.photoDataUrl ? <img src={profile.photoDataUrl} alt="Prévia da foto de perfil" /> : <span>{getUserInitials(profile.displayName)}</span>}
            </div>
            <div className="profile-photo-copy">
              <strong>Foto de perfil</strong>
              <small>JPG, PNG ou WebP. A imagem é reduzida para caber no armazenamento local.</small>
              <div className="profile-photo-actions">
                <button className="small-action" type="button" disabled={photoBusy} onClick={() => photoInputRef.current?.click()}><Camera />{photoBusy ? 'Preparando…' : 'Escolher foto'}</button>
                {profile.photoDataUrl && <button className="text-action profile-remove-photo" type="button" onClick={() => update('photoDataUrl', '')}><Trash2 />Remover</button>}
              </div>
              <input ref={photoInputRef} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" aria-label="Escolher foto de perfil" onChange={choosePhoto} />
            </div>
          </div>

          <div className="profile-fields">
            <label>Nome de exibição<input value={profile.displayName} maxLength={80} autoComplete="name" placeholder="Como quer aparecer no NEXUS?" onChange={(event) => update('displayName', event.target.value)} /></label>
            <label>Concurso ou cargo-alvo<input value={profile.targetExam} maxLength={100} placeholder="Ex.: Polícia Civil de São Paulo" onChange={(event) => update('targetExam', event.target.value)} /></label>
            <label>Banca principal<input value={profile.preferredBoard} maxLength={80} placeholder="Ex.: VUNESP" onChange={(event) => update('preferredBoard', event.target.value)} /></label>
            <label>Meta diária de questões<input type="number" min="1" max="300" value={profile.dailyQuestionGoal} onChange={(event) => update('dailyQuestionGoal', event.target.value)} /></label>
            <label className="profile-notes-field">Observações de estudo<textarea value={profile.studyNotes} maxLength={280} rows={3} placeholder="Prioridades, horários ou lembretes pessoais…" onChange={(event) => update('studyNotes', event.target.value)} /><small>{profile.studyNotes.length}/280 caracteres</small></label>
          </div>

          {message && <p className={`profile-message ${message.type}`} role="status">{message.text}</p>}
          <div className="profile-form-footer"><span><ShieldCheck /> Salvo somente neste dispositivo</span><button className="primary-action profile-save-button" type="submit" disabled={photoBusy}><Save />Salvar perfil</button></div>
        </form>

        <aside className="profile-summary-card" aria-label="Resumo do perfil">
          <span className="profile-summary-kicker">PRÉVIA DO PERFIL</span>
          <div className="profile-summary-avatar">{profile.photoDataUrl ? <img src={profile.photoDataUrl} alt="" /> : <span>{getUserInitials(profile.displayName)}</span>}</div>
          <h2>{profile.displayName.trim() || 'Seu perfil'}</h2>
          <p>{profile.targetExam.trim() || 'Defina um concurso ou cargo-alvo'}</p>
          <div className="profile-summary-details">
            <div><Target /><span><small>Banca principal</small><b>{profile.preferredBoard.trim() || 'Não definida'}</b></span></div>
            <div><Target /><span><small>Meta diária</small><b>{Number(profile.dailyQuestionGoal) || 20} questões</b></span></div>
          </div>
          <small className="profile-summary-note">A foto é mantida localmente neste navegador.</small>
        </aside>
      </div>
    </section>
  );
}
