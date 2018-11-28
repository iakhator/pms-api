require('dotenv').config()

module.exports = {
  'development': {
    use_env_variable: 'DEVELOPMENT_DB'
  },
  'test': {
    use_env_variable: 'TEST_DB'
  },
  'production': {
    use_env_variable: 'PRODUCTION_DB',
    dialect: 'postgres'
  }
}
