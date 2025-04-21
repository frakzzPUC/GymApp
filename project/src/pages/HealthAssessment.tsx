import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale } from 'lucide-react';
import styles from '../styles/HealthAssessment.module.css';

function HealthAssessment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
  });

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100;
    return (weight / (height * height)).toFixed(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/pain');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.iconContainer}>
          <Scale className={styles.icon} />
        </div>
        <h1 className={styles.title}>
          Avaliação de Saúde
        </h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              required
              className={styles.input}
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Altura (cm)
            </label>
            <input
              type="number"
              required
              className={styles.input}
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            />
          </div>

          {formData.weight && formData.height && (
            <div className={styles.bmiResult}>
              <p className={styles.bmiText}>
                Seu IMC é: <span className={styles.bmiValue}>{calculateBMI()}</span>
              </p>
            </div>
          )}

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

export default HealthAssessment;