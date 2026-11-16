<div align="center">

# 🎓 API Acadêmica

### Laboratório de APIs REST e Testes de Software

**Node.js · Express · Insomnia · JavaScript**

Uma API simples, comentada e preparada para aprender **requisições HTTP, respostas JSON e testes de endpoints**, sem necessidade de frontend.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Insomnia](https://img.shields.io/badge/Insomnia-4000BF?style=for-the-badge&logo=insomnia&logoColor=white)

</div>

---

## 📖 Sobre o projeto

A **API Acadêmica** é um projeto didático criado para as aulas de **Testes de Software em APIs REST** do curso Técnico em Desenvolvimento de Sistemas.

Nesta primeira versão, os dados são armazenados em um **array JavaScript**, permitindo concentrar a aprendizagem no funcionamento do backend e na execução de testes com o **Insomnia**.

O código-fonte de `app.js` foi pensado para ser **comentado e explorado pelos alunos**, favorecendo a compreensão de cada etapa da requisição e da resposta.

### 🎯 Objetivos de aprendizagem

- Compreender o funcionamento de uma API REST.
- Identificar métodos e códigos de status HTTP.
- Enviar requisições e interpretar respostas JSON.
- Testar cenários positivos e negativos usando o Insomnia.
- Documentar resultados esperados, obtidos e defeitos observados.
- Preparar a base para atividades futuras de **testes funcionais, segurança, carga e regressão**.

> [!NOTE]
> Esta é uma **versão introdutória**. A implementação atual contém **GET e POST**. Os endpoints de atualização, exclusão, autenticação e persistência em banco de dados poderão ser incorporados em etapas futuras.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| **Node.js** | Executar JavaScript no servidor |
| **Express** | Criar o servidor HTTP e definir os endpoints |
| **JavaScript** | Implementar as regras de negócio |
| **Insomnia** | Enviar requisições e inspecionar respostas |
| **Visual Studio Code** | Editar e executar o projeto |
| **Array em memória** | Simular o armazenamento de alunos |

---

## 📂 Estrutura inicial

```text
api-academica/
├── app.js          # Servidor Express e rotas da API
├── package.json    # Dependências e configurações do projeto
├── package-lock.json
└── README.md       # Documentação do laboratório
```

A pasta `node_modules/` é gerada durante a instalação e **não deve ser enviada ao Git**.

### `.gitignore` recomendado

```gitignore
node_modules/
.env
*.log
coverage/
```

---

## 🚀 Instalação e execução

### Pré-requisitos

- Node.js e npm instalados.
- Um editor de código, como o Visual Studio Code.
- Insomnia instalado para realizar os testes.

### 1. Obtenha o projeto

Clone o repositório (substitua pela URL do seu repositório após publicá-lo):

```bash
git clone URL_DO_SEU_REPOSITORIO
cd api-academica
```

Ou baixe os arquivos do projeto e abra a pasta no terminal.

### 2. Instale as dependências

```bash
npm install
```

> Se estiver montando o projeto do zero, utilize `npm init -y` e `npm install express`.

### 3. Inicie a API

```bash
node app.js
```

Saída esperada:

```text
API em http://127.0.0.1:3000
```

A aplicação ficará disponível **somente na própria máquina** pelo endereço `http://127.0.0.1:3000`.

---

## 🧭 Endpoints disponíveis

| Método | Endpoint | Finalidade | Respostas esperadas |
|:---:|---|---|---|
| `GET` | `/api/health` | Verificar se a API está funcionando | `200` |
| `GET` | `/api/alunos` | Listar alunos | `200` |
| `GET` | `/api/alunos/:id` | Consultar um aluno por ID | `200`, `404` |
| `POST` | `/api/alunos` | Cadastrar um aluno | `201`, `400`, `409` |

**URL base:** `http://127.0.0.1:3000`

### 👩‍🎓 Dados iniciais

Ao iniciar o servidor, a API possui dois registros fictícios para os exercícios:

| ID | RA | Nome | Curso |
|---:|---|---|---|
| 1 | 2026001 | Aline Francisca | Desenvolvimento de Sistemas |
| 2 | 2026002 | Marcos Costa | Desenvolvimento de Sistemas |

Os e-mails utilizados nos exemplos pertencem ao domínio reservado `exemplo.test` e são **meramente ilustrativos**.

---

## 🧪 Testando com Insomnia

Crie uma coleção chamada **API Acadêmica — Testes** no Insomnia e execute os exemplos a seguir.

### ✅ Teste 1 — Verificar disponibilidade

```http
GET http://127.0.0.1:3000/api/health
```

**Resposta esperada — `200 OK`:**

```json
{
  "status": "ok",
  "mensagem": "API em funcionamento"
}
```

### 📋 Teste 2 — Listar alunos

```http
GET http://127.0.0.1:3000/api/alunos
```

**Resposta esperada — `200 OK`:** um array JSON com os alunos cadastrados.

### 🔎 Teste 3 — Consultar um aluno

```http
GET http://127.0.0.1:3000/api/alunos/1
```

**Resposta esperada — `200 OK`:**

```json
{
  "id": 1,
  "ra": "2026001",
  "nome": "Aline Francisca",
  "email": "aline@exemplo.test",
  "curso": "Desenvolvimento de Sistemas"
}
```

### ⚠️ Teste 4 — Consultar ID inexistente

```http
GET http://127.0.0.1:3000/api/alunos/999
```

**Resposta esperada — `404 Not Found`:**

```json
{
  "erro": "Aluno não encontrado"
}
```

> [!TIP]
> Um **HTTP 404 pode indicar um teste aprovado**, quando o requisito é justamente retornar “não encontrado” para um ID inexistente.

### ➕ Teste 5 — Cadastrar um aluno

```http
POST http://127.0.0.1:3000/api/alunos
Content-Type: application/json
```

No Insomnia, selecione **Body → JSON** e envie:

```json
{
  "ra": "2026003",
  "nome": "Mariana Costa",
  "email": "mariana@exemplo.test",
  "curso": "Desenvolvimento de Sistemas"
}
```

**Resposta esperada — `201 Created`:**

```json
{
  "id": 3,
  "ra": "2026003",
  "nome": "Mariana Costa",
  "email": "mariana@exemplo.test",
  "curso": "Desenvolvimento de Sistemas"
}
```

O ID `3` é esperado quando esse é o primeiro cadastro realizado após iniciar o servidor.

### 🚫 Testes negativos

Experimente também:

- Enviar um cadastro **sem nome** → esperado `400 Bad Request`.
- Enviar um cadastro com **RA já utilizado** → esperado `409 Conflict`.
- Consultar um ID inexistente → esperado `404 Not Found`.

Esses cenários verificam se a API rejeita corretamente entradas que violam o contrato definido.

---

## 📝 Atividade prática — Primeira inspeção da API

Atue como integrante da equipe de testes responsável por analisar o funcionamento inicial da API Acadêmica.

**Seu desafio:**

1. Verificar o endpoint `/api/health`.
2. Listar todos os alunos.
3. Consultar Aline Francisca pelo ID `1`.
4. Consultar Marcos Costa pelo ID `2`.
5. Consultar um ID inexistente.
6. Cadastrar um novo aluno.
7. Tentar cadastrar um RA duplicado.
8. Tentar cadastrar um aluno sem nome.
9. Registrar os códigos HTTP retornados.
10. Identificar uma limitação da implementação atual.

### Modelo para registrar as evidências

| Caso | Endpoint | HTTP esperado | HTTP obtido | Resultado |
|---|---|---:|---|---|
| CT-01 | `GET /api/health` | 200 | A preencher | A preencher |
| CT-02 | `GET /api/alunos` | 200 | A preencher | A preencher |
| CT-03 | `GET /api/alunos/1` | 200 | A preencher | A preencher |
| CT-04 | `GET /api/alunos/2` | 200 | A preencher | A preencher |
| CT-05 | `GET /api/alunos/999` | 404 | A preencher | A preencher |
| CT-06 | `POST /api/alunos` (válido) | 201 | A preencher | A preencher |
| CT-07 | `POST /api/alunos` (RA duplicado) | 409 | A preencher | A preencher |
| CT-08 | `POST /api/alunos` (sem nome) | 400 | A preencher | A preencher |

**Entrega:** coleção de requisições do Insomnia e relatório com resultados esperados, obtidos e observações.

---

## 🧠 Conceitos importantes

| Conceito | Explicação |
|---|---|
| **Endpoint** | Endereço de uma operação disponibilizada pela API |
| **Request** | Requisição enviada pelo cliente |
| **Response** | Resposta enviada pelo servidor |
| **JSON** | Formato textual de troca de dados |
| **Status HTTP** | Código que descreve o resultado da requisição |
| **Teste positivo** | Verificação com entradas e condições válidas |
| **Teste negativo** | Verificação com entradas inválidas ou condições não permitidas |
| **Caso de teste** | Cenário com condições, procedimento e resultado esperado |

---

## 🔭 Próximas etapas do laboratório

Esta primeira versão será a base para evoluções didáticas, incluindo:

- Implementação dos métodos `PUT` e `DELETE`.
- Persistência dos dados em banco de dados.
- Testes funcionais e verificações automatizadas de endpoints.
- Autenticação e autorização.
- Análises de segurança **somente em ambiente de laboratório autorizado** com OWASP ZAP.
- Testes de carga locais, progressivos e controlados com k6.
- Correção de defeitos, regressão e versionamento com Git.

> [!IMPORTANT]
> **Projeto educacional:** a versão atual não foi projetada para exposição pública ou uso em produção. Os dados ficam somente na memória, não há autenticação e o foco é a aprendizagem em ambiente local.

---

<div align="center">

**📚 Material de apoio para aulas de Testes de Software em APIs REST**

*Aprender testando, documentando e melhorando o software.*

</div>
