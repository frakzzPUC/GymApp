import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import styles from '../styles/LifestyleForm.module.css';

function LifestyleForm() {
  const navigate = useNavigate();
  const [lifestyle, setLifestyle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/health');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.iconContainer}>
          <Activity className={styles.icon} />
        </div>
        <h1 className={styles.title}>
          Seu Estilo de Vida
        </h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <label className={styles.sectionTitle}>
              Como você descreveria seu estilo de vida?
            </label>
            <div className={styles.options}>
              <label className={styles.option}>
                <input
                  type="radio"
                  name="lifestyle"
                  value="sedentary"
                  checked={lifestyle === 'sedentary'}
                  onChange={(e) => setLifestyle(e.target.value)}
                  className={styles.radio}
                />
                <span>Sedentário (pouca ou nenhuma atividade física)</span>
              </label>

              <label className={styles.option}>
                <input
                  type="radio"
                  name="lifestyle"
                  value="lightly_active"
                  checked={lifestyle === 'lightly_active'}
                  onChange={(e) => setLifestyle(e.target.value)}
                  className={styles.radio}
                />
                <span>Levemente ativo (exercícios leves 1-3 dias/semana)</span>
              </label>

              <label className={styles.option}>
                <input
                  type="radio"
                  name="lifestyle"
                  value="moderately_active"
                  checked={lifestyle === 'moderately_active'}
                  onChange={(e) => setLifestyle(e.target.value)}
                  className={styles.radio}
                />
                <span>Moderadamente ativo (exercícios moderados 3-5 dias/semana)</span>
              </label>

              <label className={styles.option}>
                <input
                  type="radio"
                  name="lifestyle"
                  value="very_active"
                  checked={lifestyle === 'very_active'}
                  onChange={(e) => setLifestyle(e.target.value)}
                  className={styles.radio}
                />
                <span>Muito ativo (exercícios intensos 6-7 dias/semana)</span>
              </label>
            </div>
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

export default LifestyleForm;