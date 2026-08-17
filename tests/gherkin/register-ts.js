// Register ts-node before loading any TypeScript files
// Set ENV environment variable early to ensure HelpersApi can access it
if (!process.env.ENV) {
  process.env.ENV = 'stg'
}

const path = require('path')
require('ts-node').register({
  project: path.join(__dirname, 'tsconfig.json'),
  transpileOnly: true,
  files: true,
  compilerOptions: {
    module: 'commonjs',
    esModuleInterop: true,
    resolveJsonModule: true,
    moduleResolution: 'node',
    baseUrl: path.join(__dirname, '../..'),
  }
})

