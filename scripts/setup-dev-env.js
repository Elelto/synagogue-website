const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

// Generate a secure random secret for NextAuth
const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Environment variables for frontend
const frontendEnv = `# Authentication
NEXTAUTH_SECRET=${generateSecret()}
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
`;

// Environment variables for backend
const backendEnv = `# Server Configuration
PORT=3001
NODE_ENV=development

# Authentication
NEXTAUTH_SECRET=${generateSecret()}

# Database Configuration
DATABASE_URL="file:./dev.db"
`;

// Write environment files
const writeEnvFile = (dir, content) => {
  const envPath = path.join(dir, '.env');
  fs.writeFileSync(envPath, content);
  console.log(`Created .env file in ${dir}`);
};

try {
  // Create frontend .env
  writeEnvFile(frontendDir, frontendEnv);

  // Create backend .env
  writeEnvFile(backendDir, backendEnv);

  console.log('\nDevelopment environment setup complete!');
  console.log('\nMake sure to:');
  console.log('1. Start the backend server: cd backend && npm run dev');
  console.log('2. Start the frontend server: cd frontend && npm run dev');
  console.log('\nBackend will run on http://localhost:3001');
  console.log('Frontend will run on http://localhost:3000');
} catch (error) {
  console.error('Error setting up development environment:', error);
  process.exit(1);
}
