/**
 * Système de logs structuré avec couleurs
 * Facilite le débogage et le suivi des événements
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

export const logger = {
  /**
   * Log d'information générale
   * @param {string} message - Message à logger
   */
  info: (message) => {
    console.log(`${colors.blue}[INFO]${colors.reset} ${message}`);
  },

  /**
   * Log de succès
   * @param {string} message - Message à logger
   */
  success: (message) => {
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`);
  },

  /**
   * Log d'avertissement
   * @param {string} message - Message à logger
   */
  warning: (message) => {
    console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`);
  },

  /**
   * Log d'erreur
   * @param {string} message - Message à logger
   * @param {Error} error - Objet erreur optionnel
   */
  error: (message, error = null) => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${message}`);
    if (error && process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  },

  /**
   * Log de requête HTTP
   * @param {string} method - Méthode HTTP
   * @param {string} path - Chemin de la requête
   * @param {number} status - Code de statut HTTP
   */
  http: (method, path, status) => {
    const color = status >= 500 ? colors.red : status >= 400 ? colors.yellow : colors.green;
    console.log(`${colors.cyan}[HTTP]${colors.reset} ${method} ${path} ${color}${status}${colors.reset}`);
  }
};
