
/*
 * AUTENTICAÇÃO E AUTORIZAÇÃO
 * API Acadêmica - Laboratório
 *
 * Contas exclusivamente didáticas.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Usuários fictícios do laboratório.
const usuarios = [
  {
    id: 1,
    nome: 'Aline Francisca',
    email: 'aline@exemplo.test',
    perfil: 'admin',
    senhaHash: bcrypt.hashSync(
      'SenhaLabAline2026!', 10
    )
  },
  {
    id: 2,
    nome: 'Marcos Costa',
    email: 'marcos@exemplo.test',
    perfil: 'leitor',
    senhaHash: bcrypt.hashSync(
      'SenhaLabMarcos2026!', 10
    )
  }
];

/*
 * LOGIN
 *
 * Verifica as credenciais e retorna
 * um token JWT quando são válidas.
 */
async function login(req, res) {

  const { email, senha } = req.body || {};

  if (
    typeof email !== 'string' ||
    typeof senha !== 'string'
  ) {
    return res.status(400).json({
      erro: 'Credenciais obrigatórias'
    });
  }

  // Procura o usuário pelo e-mail.
  const usuario = usuarios.find(
    u => u.email === email
  );

  // Compara a senha com o hash.
  // Usa um hash reserva para não depender
  // da existência do usuário.
  const hash = usuario
    ? usuario.senhaHash
    : hashReserva;

  const senhaValida = await bcrypt.compare(
    senha, hash
  );

  if (!usuario || !senhaValida) {
    return res.status(401).json({
      erro: 'Credenciais inválidas'
    });
  }

  // Cria um token assinado.
  const token = jwt.sign(
    {
      sub: String(usuario.id)
    },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  );

  return res.status(200).json({
    token,
    tipo: 'Bearer'
  });
}

// Hash de referência para usuário inexistente.
const hashReserva = bcrypt.hashSync(
  'SenhaReservaNaoUtilizada!', 10
);

/*
 * MIDDLEWARE DE AUTENTICAÇÃO
 *
 * Verifica se a requisição possui
 * um token válido.
 */
function autenticar(req, res, next) {

  const cabecalho = req.headers.authorization;

  if (
    !cabecalho ||
    !cabecalho.startsWith('Bearer ')
  ) {
    return res.status(401).json({
      erro: 'Autenticação necessária'
    });
  }

  const token = cabecalho.slice(7);

  try {

    // Verifica assinatura e validade.
    const dados = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    // Recupera o usuário atual.
    const usuario = usuarios.find(
      u => String(u.id) === dados.sub
    );

    if (!usuario) {
      return res.status(401).json({
        erro: 'Usuário não encontrado'
      });
    }

    // Disponibiliza a identidade para as rotas.
    req.usuario = {
      id: usuario.id,
      perfil: usuario.perfil
    };

    next();

  } catch (erro) {

    return res.status(401).json({
      erro: 'Token inválido ou expirado'
    });

  }
}

/*
 * MIDDLEWARE DE AUTORIZAÇÃO
 *
 * Verifica se o perfil autenticado
 * possui a permissão exigida.
 */
function autorizar(perfilPermitido) {

  return (req, res, next) => {

    if (req.usuario?.perfil !== perfilPermitido) {
      return res.status(403).json({
        erro: 'Acesso não autorizado'
      });
    }

    next();
  };
}

module.exports = {
  login,
  autenticar,
  autorizar
};