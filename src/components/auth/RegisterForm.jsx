import { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRENGTH_LABELS = ['', 'Fraca', 'Média', 'Forte'];
const STRENGTH_CLASSES = ['', 'weak', 'medium', 'strong'];

function fieldClass(state) {
  if (state === 'valid') return 'form-input success';
  if (state === 'invalid') return 'form-input error';
  return 'form-input';
}

function getStrength(password) {
  if (password.length < 6) return 0;
  let score = 1;
  if (password.length >= 8) score++;
  if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

export default function RegisterForm({ onSubmit, onGoToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [nameState, setNameState] = useState(null);
  const [emailState, setEmailState] = useState(null);
  const [passwordState, setPasswordState] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const strength = getStrength(password);

  function validateName(value) {
    return value ? (value.trim().length >= 2 ? 'valid' : 'invalid') : null;
  }
  function validateEmail(value) {
    return value ? (EMAIL_REGEX.test(value.trim()) ? 'valid' : 'invalid') : null;
  }
  function validatePassword(value) {
    return value ? (value.length >= 6 ? 'valid' : 'invalid') : null;
  }
  function validateConfirm(value, pw) {
    return value ? (value === pw && value.length > 0 ? 'valid' : 'invalid') : null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nameResult = validateName(name);
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    const confirmResult = validateConfirm(confirm, password);

    setNameState(nameResult);
    setEmailState(emailResult);
    setPasswordState(passwordResult);
    setConfirmState(confirmResult);

    if ([nameResult, emailResult, passwordResult, confirmResult].some((r) => r !== 'valid')) return;

    onSubmit({ name: name.trim(), email: email.trim() });
  }

  return (
    <form className="form" id="form-register" noValidate aria-label="Formulário de cadastro" onSubmit={handleSubmit}>
      <div className="auth-header">
        <h2>Crie sua conta</h2>
        <p>Preencha os dados abaixo para começar.</p>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-name">
          Nome completo
        </label>
        <input
          className={fieldClass(nameState)}
          type="text"
          id="reg-name"
          placeholder="Seu nome completo"
          autoComplete="name"
          value={name}
          onChange={(e) => { setName(e.target.value); if (nameState !== null) setNameState(validateName(e.target.value)); }}
          onBlur={(e) => setNameState(validateName(e.target.value))}
        />
        <span className={`form-error${nameState === 'invalid' ? ' show' : ''}`} role="alert">
          Por favor, insira seu nome.
        </span>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-email">
          E-mail
        </label>
        <input
          className={fieldClass(emailState)}
          type="email"
          id="reg-email"
          placeholder="seu@email.com"
          autoComplete="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (emailState !== null) setEmailState(validateEmail(e.target.value)); }}
          onBlur={(e) => setEmailState(validateEmail(e.target.value))}
        />
        <span className={`form-error${emailState === 'invalid' ? ' show' : ''}`} role="alert">
          Insira um e-mail válido.
        </span>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-password">
          Senha
        </label>
        <div className="form-input-wrap">
          <input
            className={fieldClass(passwordState)}
            type={showPassword ? 'text' : 'password'}
            id="reg-password"
            placeholder="Crie uma senha"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordState !== null) setPasswordState(validatePassword(e.target.value));
              if (confirm) setConfirmState(validateConfirm(confirm, e.target.value));
            }}
            onBlur={(e) => setPasswordState(validatePassword(e.target.value))}
          />
          <button
            type="button"
            className="input-icon"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>
        <div className="password-strength" aria-hidden="true">
          {[1, 2, 3].map((bar) => (
            <div
              key={bar}
              className={`strength-bar${bar <= strength ? ' ' + STRENGTH_CLASSES[strength] : ''}`}
            />
          ))}
        </div>
        <span className="strength-label">{password.length ? STRENGTH_LABELS[strength] : ''}</span>
        <span className={`form-error${passwordState === 'invalid' ? ' show' : ''}`} role="alert">
          A senha deve ter pelo menos 6 caracteres.
        </span>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-confirm">
          Confirmar senha
        </label>
        <input
          className={fieldClass(confirmState)}
          type="password"
          id="reg-confirm"
          placeholder="Repita a senha"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => { setConfirm(e.target.value); setConfirmState(validateConfirm(e.target.value, password)); }}
        />
        <span className={`form-error${confirmState === 'invalid' ? ' show' : ''}`} role="alert">
          As senhas não coincidem.
        </span>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Criar conta
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
        Já tem conta?{' '}
        <button
          type="button"
          className="form-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
          onClick={onGoToLogin}
        >
          Entrar
        </button>
      </p>
    </form>
  );
}
