# API Acadêmica — Capítulo 13

## Depuração de parâmetros de rota

Coloque um breakpoint na conversão do ID na rota de consulta. Com um token de leitor, consulte /api/alunos/1 e /api/alunos/abc. Compare req.params.id, o resultado de Number() e o status HTTP. Registre o comportamento antes de propor uma correção.

Instale as dependências com `npm ci` e execute `node app.js`. A API atende em `http://127.0.0.1:3000`.

Antes de iniciar, crie um arquivo `.env` contendo `JWT_SECRET=` seguido de um segredo local de pelo menos 32 caracteres. Para gerar um valor, execute `node -p "require('crypto').randomBytes(32).toString('hex')"`. Use as contas didáticas de `auth.js` para obter um token em `POST /api/auth/login`.
