import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import styles from '../styles/Register.module.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement Supabase authentication and user creation
    navigate('/lifestyle');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.iconContainer}>
          <UserPlus className={styles.icon} />
        </div>
        <h1 className={styles.title}>
          Cadastro
        </h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Nome
            </label>
            <input
              type="text"
              required
              className={styles.input}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Email
            </label>
            <input
              type="email"
              required
              className={styles.input}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Senha
            </label>
            <input
              type="password"
              required
              className={styles.input}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Idade
            </label>
            <input
              type="number"
              required
              className={styles.input}
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register