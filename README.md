# API Acadêmica — Capítulo 10

## Carga básica

Com a API local em execução, execute `k6 run test/k6/carga-basica.js` e registre os resultados da atividade.

Instale as dependências com `npm ci` e execute `node app.js`. A API atende em `http://127.0.0.1:3000`.

Antes de iniciar, crie um arquivo `.env` contendo `JWT_SECRET=` seguido de um segredo local de pelo menos 32 caracteres. Para gerar um valor, execute `node -p "require('crypto').randomBytes(32).toString('hex')"`. Use as contas didáticas de `auth.js` para obter um token em `POST /api/auth/login`.
