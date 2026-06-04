import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
    globals: true,
    environmet: 'node',
    setupFiles: ['./test/setup.js'],
    coverage: {
    provider: 'v8', // ou 'istanbul'
    reporter: ['text', 'html', 'json'], // 'text' mostra no terminal
    include: [
        'src/modules/user/user.service.js', 
        'src/modules/health/health.service.js', 
        'src/modules/user/user.controller.js'
    ],
    exclude: [
        '**/node_modules/**',
        '**/test/**',
        '**/__tests__/**',
        'src/config/**', // não serão testados os arquivos da pasta /config
        'src/middlewares/**', // não serão testados os arquivos da pasta /middlewares
        'src/server.js', // o arquivo server.js não será testado
        'src/app.js' // o arquivo app.js não será testado
    ],
    thresholds: {
// opcional: força meta mínima
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80
    }
}
}
});