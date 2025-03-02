module.exports = {
  apps: [
    {
      name: 'synagogue-backend',
      script: './dist/server.js',
      cwd: './backend',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'synagogue-frontend',
      script: './node_modules/.bin/next',
      args: 'start -p 3000',
      cwd: './frontend',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
