import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.title}>Transforme sua saúde</h1>
            <p className={styles.subtitle}>Descubra o poder de uma vida saudável!</p>
            <div className={styles.buttonGroup}>
              <Link to="/login" className={styles.buttonPrimary}>
                Login
              </Link>
              <Link to="/register" className={styles.buttonSecondary}>
                Cadastre-se
              </Link>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="Fitness" 
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={styles.features}>
        <div className="container mx-auto px-4">
          <h2 className={styles.featuresTitle}>Nossos Serviços</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏋️‍♂️</div>
              <h3 className={styles.featureTitle}>Avaliação de Saúde</h3>
              <p>Realize uma avaliação completa da sua saúde e bem-estar.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3 className={styles.featureTitle}>Análise de Dados</h3>
              <p>Receba insights personalizados baseados em seus dados.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
              <h3 className={styles.featureTitle}>Recomendações</h3>
              <p>Obtenha orientações específicas para melhorar sua saúde.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Pronto para começar sua jornada?</h2>
        <p className={styles.ctaText}>Junte-se a nós e dê o primeiro passo para uma vida mais saudável.</p>
        <Link to="/register" className={styles.ctaButton}>
          Começar Agora
        </Link>
      </div>
    </div>
  );
};

export default Home; 