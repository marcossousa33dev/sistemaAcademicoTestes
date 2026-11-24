# API Acadêmica — Capítulo 9

## Inspeção passiva

Realize as requisições da atividade no laboratório local e registre os alertas passivos. Para cada alerta, documente rota, evidência, impacto e conclusão.

Instale as dependências com `npm ci` e execute `node app.js`. A API atende em `http://127.0.0.1:3000`.

Antes de iniciar, crie um arquivo `.env` contendo `JWT_SECRET=` seguido de um segredo local de pelo menos 32 caracteres. Para gerar um valor, execute `node -p "require('crypto').randomBytes(32).toString('hex')"`. Use as contas didáticas de `auth.js` para obter um token em `POST /api/auth/login`.
