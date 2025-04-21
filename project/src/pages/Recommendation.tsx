import React from 'react';
import { CheckCircle } from 'lucide-react';
import styles from '../styles/Recommendation.module.css';

function Recommendation() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <CheckCircle className={styles.icon} />
        </div>
        <h1 className={styles.title}>
          Recomendação Personalizada
        </h1>
        
        <div className={styles.content}>
          <p className={styles.mainText}>
            Aqui {'{user}'}, pode estar um plano adequado para você com base nas suas respostas.
          </p>
          
          <p className={styles.subText}>
            Em breve, você receberá um plano personalizado baseado em suas necessidades específicas.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Recommendation;