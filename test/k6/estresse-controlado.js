
/*
 * AULA 12 - ESTRESSE CONTROLADO
 *
 * Objetivo:
 * Verificar o comportamento da API
 * durante aumentos moderados de carga.
 *
 * Ambiente:
 * Exclusivamente local e autorizado.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

// Endereço local da API.
const BASE_URL =
  'http://127.0.0.1:3000';

/*
 * CONFIGURAÇÃO
 */
export const options = {

  scenarios: {

    estresse_local: {

      executor: 'ramping-vus',

      // Começa com um usuário virtual.
      startVUs: 1,

      // Aumenta e reduz a carga.
      stages: [
        { duration: '15s', target: 2 },
        { duration: '15s', target: 4 },
        { duration: '15s', target: 6 },
        { duration: '15s', target: 3 },
        { duration: '15s', target: 1 },
        { duration: '10s', target: 0 }
      ]
    }
  },

  // Metas didáticas do exercício.
  thresholds: {

    http_req_failed: [
      'rate<0.01'
    ],

    http_req_duration: [
      'p(95)<500'
    ]
  }
};

/*
 * FUNÇÃO EXECUTADA PELOS VUs
 */
export default function () {

  // Envia a requisição GET.
  const resposta = http.get(
    `${BASE_URL}/api/health`
  );

  // Verifica o código de resposta.
  check(resposta, {

    'API respondeu HTTP 200': (r) =>
      r.status === 200

  });

  // Pausa de um segundo.
  sleep(1);
}
