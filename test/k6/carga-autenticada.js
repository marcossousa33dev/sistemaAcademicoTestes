
/*
 * AULA 11 - CARGA AUTENTICADA
 *
 * Objetivo:
 * Avaliar o GET /api/alunos utilizando
 * autenticação JWT e usuários virtuais.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

// Endereço da API Acadêmica.
const BASE_URL =
  'http://127.0.0.1:3000';

/*
 * CENÁRIO DE CARGA
 *
 * Inicia com poucos usuários,
 * aumenta gradualmente e depois
 * reduz a quantidade de VUs.
 */
export const options = {

  scenarios: {

    consulta_alunos: {

      executor: 'ramping-vus',

      // Um usuário virtual inicial.
      startVUs: 1,

      // Etapas da execução.
      stages: [
        { duration: '15s', target: 2 },
        { duration: '15s', target: 4 },
        { duration: '15s', target: 6 },
        { duration: '15s', target: 2 },
        { duration: '15s', target: 0 }
      ]
    }
  },

  thresholds: {

    // Menos de 1% de falhas HTTP.
    http_req_failed: ['rate<0.01'],

    // 95% das respostas abaixo de 500 ms.
    http_req_duration: ['p(95)<500']
  }
};

/*
 * PREPARAÇÃO
 *
 * setup() é executada antes dos VUs.
 * Vamos obter um token para as consultas.
 */
export function setup() {

  // Lê a senha do ambiente local.
  const senha = __ENV.K6_SENHA_LEITOR;

  if (!senha) {
    throw new Error(
      'Defina K6_SENHA_LEITOR'
    );
  }

  // Envia as credenciais do leitor.
  const resposta = http.post(
    `${BASE_URL}/api/auth/login`,

    JSON.stringify({
      email: 'marcos@exemplo.test',
      senha: senha
    }),

    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  // Confirma que o login funcionou.
  if (resposta.status !== 200) {
    throw new Error(
      `Falha no login: HTTP ${resposta.status}`
    );
  }

  const dados = resposta.json();

  // Confere se o token foi retornado.
  if (!dados.token) {
    throw new Error(
      'Token JWT não foi recebido'
    );
  }

  /*
   * Disponibiliza o token para
   * os usuários virtuais.
   */
  return {
    token: dados.token
  };
}

/*
 * TESTE EXECUTADO PELOS VUs
 */
export default function (dados) {

  // Consulta a lista de alunos.
  const resposta = http.get(
    `${BASE_URL}/api/alunos`,

    {
      headers: {
        Authorization:
          `Bearer ${dados.token}`
      },

      tags: {
        endpoint: 'listar_alunos'
      }
    }
  );

  // Verifica o resultado.
  check(resposta, {

    'Retorna HTTP 200': (r) =>
      r.status === 200,

    'Retorna uma lista JSON': (r) => {
      try {
        return Array.isArray(r.json());
      } catch {
        return false;
      }
    }

  });

  // Aguarda entre as consultas.
  sleep(1);
}
