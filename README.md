# API Acadêmica — Capítulo 4

## Testes funcionais

Use o Insomnia com autenticação **No Auth**. Cadastre um aluno com RA, nome, e-mail e curso (201), consulte o ID recebido (200), envie os quatro campos em PUT (200), confira a alteração em GET, exclua em DELETE (204) e consulte o mesmo ID novamente (404). As rotas de alunos têm como base `/api/alunos`.

Instale as dependências com `npm ci` e execute `node app.js`. A API atende em `http://127.0.0.1:3000`.
