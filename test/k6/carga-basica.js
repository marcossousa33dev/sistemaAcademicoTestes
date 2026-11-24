
/*
 * AULA 10 - TESTE DE CARGA BÁSICA
 *
 * Objetivo:
 * Verificar a disponibilidade e o tempo
 * de resposta do endpoint /api/health.
 *
 * Ambiente:
 * API Acadêmica executada localmente.
 */

// Biblioteca para requisições HTTP.
import http from 'k6/http';

// Funções de verificação e pausa.
import { check, sleep } from 'k6';

/*
 * CONFIGURAÇÃO DO TESTE
 */
export const options = {

  // Dois usuários virtuais.
  vus: 2,

  // Duração total de 20 segundos.
  duration: '20s',

  // Critérios ilustrativos de aprovação.
  thresholds: {

    // Menos de 1% das requisições deve falhar.
    http_req_failed: ['rate<0.01'],

    // 95% das requisições devem
    // durar menos de 500 milissegundos.
    http_req_duration: ['p(95)<500']
  }
};

/*
 * FUNÇÃO EXECUTADA PELOS VUs
 *
 * Cada VU executa repetidamente esta
 * função durante o tempo configurado.
 */
export default function () {

  // Envia uma requisição HTTP GET.
  const resposta = http.get(
    'http://127.0.0.1:3000/api/health'
  );

  /*
   * check() verifica se a resposta
   * atende às condições especificadas.
   */
  check(resposta, {

    'Retorna HTTP 200': (r) =>
      r.status === 200,

    'Retorna status ok': (r) => {
      try {
        return r.json('status') === 'ok';
      } catch {
        return false;
      }
    }

  });

  /*
   * Aguarda um segundo para evitar
   * requisições contínuas sem pausa.
   */
  sleep(1);
}
