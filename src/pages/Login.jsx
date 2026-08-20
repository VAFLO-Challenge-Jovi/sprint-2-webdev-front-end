import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import LoginForm from '../components/auth/LoginForm.jsx';
import RegisterForm from '../components/auth/RegisterForm.jsx';

export default function Login() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [, setSession] = useLocalStorage('seekvision_user', null);
  const showToast = useToast();
  const navigate = useNavigate();

  function completeAuth(session, message) {
    setSession(session);
    showToast(message, 'success');
    setTimeout(() => navigate('/'), 1500);
  }

  return (
    <div className="auth-page">
      {/* Visual / Brand panel */}
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-logo">
            Seek<em>Vision</em>
          </div>
          <p>OCR inteligente para estudantes universitários.</p>

          <ul className="auth-feature-list">
            <li className="auth-feature-item">
              <span className="auth-feature-icon">🔬</span>
              <p>Detecção automática de texto em imagens</p>
            </li>
            <li className="auth-feature-item">
              <span className="auth-feature-icon">🔍</span>
              <p>Pesquisa instantânea no Google</p>
            </li>
            <li className="auth-feature-item">
              <span className="auth-feature-icon">📋</span>
              <p>Copie e traduza com um único toque</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-panel">
        <div className="auth-tabs" role="tablist" aria-label="Modo de acesso">
          <button
            className={`auth-tab${tab === 'login' ? ' active' : ''}`}
            role="tab"
            aria-selected={tab === 'login'}
            aria-controls="form-login"
            onClick={() => setTab('login')}
          >
            Entrar
          </button>
          <button
            className={`auth-tab${tab === 'register' ? ' active' : ''}`}
            role="tab"
            aria-selected={tab === 'register'}
            aria-controls="form-register"
            onClick={() => setTab('register')}
          >
            Criar conta
          </button>
        </div>

        {tab === 'login' ? (
          <LoginForm
            onSubmit={(session) => completeAuth(session, 'Login realizado com sucesso!')}
            onGoToRegister={() => setTab('register')}
          />
        ) : (
          <RegisterForm
            onSubmit={(session) => completeAuth(session, 'Conta criada com sucesso!')}
            onGoToLogin={() => setTab('login')}
          />
        )}
      </div>
    </div>
  );
}
