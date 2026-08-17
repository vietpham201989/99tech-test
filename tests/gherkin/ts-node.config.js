const path = require('path')
require('ts-node').register({
  project: path.resolve(__dirname, 'tsconfig.json'),
  transpileOnly: true,
  files: true,
  compilerOptions: {
    module: 'commonjs',
    esModuleInterop: true,
    resolveJsonModule: true,
    moduleResolution: 'node',
  }
})

