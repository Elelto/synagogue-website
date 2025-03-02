module.exports = {
  apps: [
    {
      name: 'synagogue-backend',
      script: 'node',
      args: './dist/server.js',
      cwd: './backend',
      watch: ['dist'],
      ignore_watch: ['node_modules', 'cache'],
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'synagogue-frontend',
      script: 'npm',
      args: 'start',
      cwd: './frontend',
      watch: ['.next'],
      ignore_watch: ['node_modules', '.next/cache', '**/cache/*'],
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
