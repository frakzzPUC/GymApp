import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import styles from '../styles/PainAssessment.module.css';

function PainAssessment() {
  const navigate = useNavigate();
  const [objective, setObjective] = useState('');
  const [painType, setPainType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/recommendation');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.iconContainer}>
          <HeartPulse className={styles.icon} />
        </div>
        <h1 className={styles.title}>
          Avaliação de Objetivos e Dores
        </h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <label className={styles.sectionTitle}>
              Escolha a opção ideal para você:
            </label>
            <div className={styles.options}>
              <label className={styles.option}>
                <input
                  type="radio"
                  name="objective"
                  value="pain"
                  checked={objective === 'pain'}
                  onChange={(e) => setObjective(e.target.value)}
                  className={styles.radio}
                />
                <span>Dores recorrentes</span>
              </label>

              <label className={styles.option}>
                <input
                  type="radio"
                  name="objective"
                  value="sedentary"
                  checked={objective === 'sedentary'}
                  onChange={(e) => setObjective(e.target.value)}
                  className={styles.radio}
                />
                <span>Sair do Sedentarismo</span>
              </label>

              <label className={styles.option}>
                <input
                  type="radio"
                  name="objective"
                  value="training"
                  checked={objective === 'training'}
                  onChange={(e) => setObjective(e.target.value)}
                  className={styles.radio}
                />
                <span>Programa de Treino/Dieta</span>
              </label>
            </div>
          </div>

          {objective === 'pain' && (
            <div className={styles.section}>
              <label className={styles.sectionTitle}>
                Qual opção se encaixa ao seu quadro?
              </label>
              <div className={styles.options}>
                <label className={styles.option}>
                  <input
                    type="radio"
                    name="painType"
                    value="back"
                    checked={painType === 'back'}
                    onChange={(e) => setPainType(e.target.value)}
                    className={styles.radio}
                  />
                  <span>Dor nas costas</span>
                </label>

                <label className={styles.option}>
                  <input
                    type="radio"
                    name="painType"
                    value="feet"
                    checked={painType === 'feet'}
                    onChange={(e) => setPainType(e.target.value)}
                    className={styles.radio}
                  />
                  <span>Dor nos pés</span>
                </label>

                <label className={styles.option}>
                  <input
                    type="radio"
                    name="painType"
                    value="neck"
                    checked={painType === 'neck'}
                    onChange={(e) => setPainType(e.target.value)}
                    className={styles.radio}
                  />
                  <span>Dor no pescoço</span>
                </label>

                <label className={styles.option}>
                  <input
                    type="radio"
                    name="painType"
                    value="knees"
                    checked={painType === 'knees'}
                    onChange={(e) => setPainType(e.target.value)}
                    className={styles.radio}
                  />
                  <span>Dor nos joelhos</span>
                </label>
              </div>
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

export default PainAssessment;