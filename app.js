
/*
 * SISTEMA ACADÊMICO - API REST
 *
 * Objetivo:
 * Criar uma API simples para demonstrar
 * o funcionamento dos métodos HTTP e
 * realizar testes com o Insomnia.
 *
 * Tecnologias:
 * Node.js + Express
 *
 * Armazenamento:
 * Array em memória.
 */

// Importa o framework Express.
const express = require('express');

// Cria uma aplicação utilizando o Express.
const app = express();

// Define a porta utilizada pelo servidor.
const PORT = 3000;

// Carrega as variáveis de ambiente.
require('dotenv').config();

// Importa funções de segurança.
const {
  login,
  autenticar,
  autorizar
} = require('./auth');

// Confere a configuração obrigatória.
if (!process.env.JWT_SECRET ||
    process.env.JWT_SECRET.length < 32) {
  throw new Error(
    'Configure uma JWT_SECRET segura no arquivo .env'
  );
}

/*
 * MIDDLEWARE
 *
 * express.json() permite que o servidor
 * receba e interprete dados no formato JSON.
 *
 * Os dados enviados no corpo da requisição
 * ficam disponíveis em req.body.
 */
app.use(express.json());

/*
 * ARMAZENAMENTO DOS ALUNOS
 *
 * Neste primeiro exemplo, utilizaremos
 * um array para simular um banco de dados.
 *
 * Atenção:
 * Os dados serão perdidos quando
 * o servidor for encerrado.
 */
const alunos = [
  {
    id: 1,
    ra: '2026001',
    nome: 'Aline Francisca',
    email: 'aline@exemplo.test',
    curso: 'Desenvolvimento de Sistemas'
  },
  {
    id: 2,
    ra: '2026002',
    nome: 'Marcos Costa',
    email: 'marcos@exemplo.test',
    curso: 'Desenvolvimento de Sistemas'
  }
];

/*
 * CONTROLE DE IDENTIFICADORES
 *
 * A variável proximoId será utilizada
 * para gerar IDs para os novos alunos.
 *
 * Como já existem os IDs 1 e 2,
 * o próximo cadastro receberá o ID 3.
 */
let proximoId = 3;

/*
 * Valida os dados de um aluno.
 *
 * Retorna null quando os dados são válidos.
 * Caso contrário, retorna uma mensagem.
 */
function validarAluno(dados) {

  // Evita acessar propriedades de valores nulos.
  if (!dados || typeof dados !== 'object' ||
      Array.isArray(dados)) {
    return 'Corpo JSON inválido';
  }

  const { ra, nome, email, curso } = dados;

  // Confere os tipos dos campos.
  if (
    typeof ra !== 'string' ||
    typeof nome !== 'string' ||
    typeof email !== 'string' ||
    typeof curso !== 'string'
  ) {
    return 'Os campos devem ser textos';
  }

  // Remove espaços nas extremidades.
  const nomeLimpo = nome.trim();

  // Verifica campos obrigatórios.
  if (
    !ra.trim() ||
    !nomeLimpo ||
    !email.trim() ||
    !curso.trim()
  ) {
    return 'Todos os campos são obrigatórios';
  }

  // Verifica o tamanho do nome.
  if (nomeLimpo.length < 3 ||
      nomeLimpo.length > 100) {
    return 'Nome deve ter entre 3 e 100 caracteres';
  }

  // Validação didática de formato de e-mail.
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formatoEmail.test(email.trim())) {
    return 'Formato de e-mail inválido';
  }

  // Nenhum problema encontrado.
  return null;
}


/*
 * ENDPOINT 01 - VERIFICAR SERVIDOR
 *
 * Método: GET
 * Rota: /api/health
 *
 * Objetivo:
 * Verificar se a API está funcionando.
 *
 * Retorno esperado:
 * HTTP 200 - OK
 */
app.get('/api/health', (req, res) => {

  // Retorna HTTP 200 com uma mensagem JSON.
  res.status(200).json({
    status: 'ok',
    mensagem: 'API em funcionamento'
  });

});

/*
 * Endpoint público de autenticação.
 */
app.post('/api/auth/login', login);

/*
 * Exige autenticação em todas
 * as rotas de /api/alunos.
 */
app.use('/api/alunos', autenticar);

/*
 * ENDPOINT 02 - LISTAR ALUNOS
 *
 * Método: GET
 * Rota: /api/alunos
 *
 * Objetivo:
 * Retornar todos os alunos cadastrados.
 *
 * Retorno esperado:
 * HTTP 200 - OK
 */
app.get('/api/alunos', (req, res) => {

  // Retorna o array completo de alunos.
  res.status(200).json(alunos);

});

/*
 * ENDPOINT 03 - CONSULTAR ALUNO POR ID
 *
 * Método: GET
 * Rota: /api/alunos/:id
 *
 * Objetivo:
 * Localizar um aluno pelo identificador.
 *
 * Exemplos:
 * /api/alunos/1
 * /api/alunos/2
 *
 * Retornos possíveis:
 * HTTP 200 - Aluno encontrado
 * HTTP 404 - Aluno não encontrado
 */
app.get('/api/alunos/:id', (req, res) => {

  /*
   * req.params.id recebe o valor
   * informado na URL.
   *
   * Exemplo:
   * /api/alunos/2
   *
   * req.params.id será "2".
   *
   * Number() converte o texto em número.
   */
  const id = Number(req.params.id);

  /*
   * find() procura um elemento no array
   * que atenda à condição estabelecida.
   *
   * Neste caso, procuramos um aluno
   * cujo ID seja igual ao solicitado.
   */
  const aluno = alunos.find(a => a.id === id);

  /*
   * Se nenhum aluno for encontrado,
   * a variável aluno será undefined.
   *
   * Nesse caso, retornamos HTTP 404.
   */
  if (!aluno) {
    return res.status(404).json({
      erro: 'Aluno não encontrado'
    });
  }

  // Retorna o aluno com HTTP 200.
  res.status(200).json(aluno);

});

/*
 * ENDPOINT 04 - CADASTRAR ALUNO
 *
 * Método: POST
 * Rota: /api/alunos
 *
 * Objetivo:
 * Receber dados JSON e cadastrar
 * um novo aluno no array.
 *
 * Retornos possíveis:
 * HTTP 201 - Cadastro realizado
 * HTTP 400 - Dados inválidos
 * HTTP 409 - RA duplicado
 */
app.post('/api/alunos', autorizar('admin'), (req, res) => {

  /*
   * DESESTRUTURAÇÃO
   *
   * Extrai os campos enviados no
   * corpo da requisição HTTP.
   */
  const erro = validarAluno(req.body);
  if (erro) {
    return res.status(400).json({ erro });
  }
  const { ra, nome, email, curso } = req.body;

  /*
   * VERIFICAÇÃO DE RA DUPLICADO
   *
   * some() verifica se existe pelo menos
   * um aluno com o RA informado.
   *
   * Retorna true se encontrar.
   */
  const raExistente = alunos.some(
    a => a.ra === ra
  );

  // Impede o cadastro de RA duplicado.
  if (raExistente) {
    return res.status(409).json({
      erro: 'RA já cadastrado'
    });
  }

  /*
   * CRIAÇÃO DO NOVO ALUNO
   *
   * O operador ++ incrementa o ID
   * após utilizar seu valor atual.
   */
  const novoAluno = {
    id: proximoId++,
    ra,
    nome,
    email,
    curso
  };

  /*
   * push() adiciona o novo aluno
   * ao final do array.
   */
  alunos.push(novoAluno);

  /*
   * Retorna HTTP 201 - Created
   * e os dados do aluno cadastrado.
   */
  res.status(201).json(novoAluno);

});

/*
 * ENDPOINT 05 - ATUALIZAR ALUNO
 *
 * Método: PUT
 * Rota: /api/alunos/:id
 *
 * Recebe os novos dados de um aluno
 * e atualiza seu registro no array.
 */
app.put('/api/alunos/:id', autorizar('admin'), (req, res) => {

  // Obtém o ID informado na URL.
  const id = Number(req.params.id);

  // Procura o aluno pelo identificador.
  const aluno = alunos.find(a => a.id === id);

  // Verifica se o aluno existe.
  if (!aluno) {
    return res.status(404).json({
      erro: 'Aluno não encontrado'
    });
  }

  // Recebe os novos dados enviados em JSON.
  const erro = validarAluno(req.body);
  if (erro) {
    return res.status(400).json({ erro });
  }
  const { ra, nome, email, curso } = req.body;

  // Verifica se outro aluno já possui o RA.
  const raDuplicado = alunos.some(
    a => a.ra === ra && a.id !== id
  );

  if (raDuplicado) {
    return res.status(409).json({
      erro: 'RA já cadastrado'
    });
  }

  // Atualiza as propriedades do aluno.
  aluno.ra = ra;
  aluno.nome = nome;
  aluno.email = email;
  aluno.curso = curso;

  // Retorna o registro atualizado.
  res.status(200).json(aluno);
});


/*
 * ENDPOINT 06 - EXCLUIR ALUNO
 *
 * Método: DELETE
 * Rota: /api/alunos/:id
 *
 * Remove um aluno do array.
 */
app.delete('/api/alunos/:id', autorizar('admin'), (req, res) => {

  // Obtém o identificador.
  const id = Number(req.params.id);

  /*
   * findIndex() retorna a posição
   * do aluno no array.
   *
   * Se não encontrar, retorna -1.
   */
  const indice = alunos.findIndex(
    a => a.id === id
  );

  // Verifica se o registro existe.
  if (indice === -1) {
    return res.status(404).json({
      erro: 'Aluno não encontrado'
    });
  }

  /*
   * splice() remove um elemento
   * a partir da posição informada.
   */
  alunos.splice(indice, 1);

  /*
   * HTTP 204 informa que a operação
   * foi concluída sem conteúdo.
   */
  return res.status(204).send();
});

/*
 * Middleware de tratamento de erros.
 *
 * Recebe erros encaminhados pelo Express
 * ou por outras funções do servidor.
 */
app.use((err, req, res, next) => {

  // Registra o problema no servidor.
  console.error(err);

  // Retorna uma mensagem genérica ao cliente.
  res.status(500).json({
    erro: 'Erro interno do servidor'
  });

});

/*
 * INICIALIZAÇÃO DO SERVIDOR
 *
 * listen() inicia o servidor HTTP.
 *
 * O endereço 127.0.0.1 limita o acesso
 * à própria máquina, adequado para
 * este laboratório introdutório.
 */
app.listen(PORT, '127.0.0.1', () => {

  console.log(
    `API em http://127.0.0.1:${PORT}`
  );

});
