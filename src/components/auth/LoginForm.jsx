import { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fieldClass(state) {
  if (state === 'valid') return 'form-input success';
  if (state === 'invalid') return 'form-input error';
  return 'form-input';
}

export default function LoginForm({ onSubmit, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailState, setEmailState] = useState(null);
  const [passwordState, setPasswordState] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  function validateEmail(value) {
    return value ? (EMAIL_REGEX.test(value.trim()) ? 'valid' : 'invalid') : null;
  }

  function validatePassword(value) {
    return value ? (value.length >= 6 ? 'valid' : 'invalid') : null;
  }

  function handleEmailChange(value) {
    setEmail(value);
    if (emailState !== null) setEmailState(validateEmail(value));
  }

  function handlePasswordChange(value) {
    setPassword(value);
    if (passwordState !== null) setPasswordState(validatePassword(value));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    setEmailState(emailResult);
    setPasswordState(passwordResult);

    if (emailResult !== 'valid' || passwordResult !== 'valid') return;
    onSubmit({ email: email.trim() });
  }

  return (
    <form className="form" id="form-login" noValidate aria-label="Formulário de login" onSubmit={handleSubmit}>
      <div className="auth-header">
        <h2>Bem-vindo de volta</h2>
        <p>Entre com seu e-mail e senha para continuar.</p>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="login-email">
          E-mail
        </label>
        <input
          className={fieldClass(emailState)}
          type="email"
          id="login-email"
          placeholder="seu@email.com"
          autoComplete="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          onBlur={(e) => setEmailState(validateEmail(e.target.value))}
        />
        <span className={`form-error${emailState === 'invalid' ? ' show' : ''}`} role="alert">
          Insira um e-mail válido.
        </span>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="login-password">
          Senha
        </label>
        <div className="form-input-wrap">
          <input
            className={fieldClass(passwordState)}
            type={showPassword ? 'text' : 'password'}
            id="login-password"
            placeholder="Sua senha"
            autoComplete="current-password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
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
        <span className={`form-error${passwordState === 'invalid' ? ' show' : ''}`} role="alert">
          A senha deve ter pelo menos 6 caracteres.
        </span>
      </div>

      <div className="form-row">
        <label className="form-check">
          <input type="checkbox" /> Lembrar de mim
        </label>
        <a href="#" className="form-link" onClick={(e) => e.preventDefault()}>
          Esqueci a senha
        </a>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Entrar
      </button>

      <div className="form-divider">ou</div>

      <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
        Não tem conta?{' '}
        <button
          type="button"
          className="form-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}
          onClick={onGoToRegister}
        >
          Criar conta grátis
        </button>
      </p>
    </form>
  );
}
