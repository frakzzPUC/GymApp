import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login attempt with:', { email, password });
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div>
          <h2 className={styles.title}>
            Entre na sua conta
          </h2>
          <p className={styles.subtitle}>
            Ou{' '}
            <Link to="/register" className={styles.forgotPassword}>
              crie uma nova conta
            </Link>
          </p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              required
              className={styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="password"
              required
              className={styles.input}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.options}>
            <div className={styles.rememberMe}>
              <input
                type="checkbox"
                className={styles.checkbox}
              />
              <label className={styles.checkboxLabel}>
                Lembrar de mim
              </label>
            </div>

            <a href="#" className={styles.forgotPassword}>
              Esqueceu sua senha?
            </a>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 