/* Estimativa de população de referência para dimensionamento das saídas — NT-11/2025, Tabela A1. */
const COEFICIENTES_POPULACAO = {
  area: {
    'B-1': 15, 'B-2': 15, 'C-1': 5, 'C-2': 5, 'C-3': 5,
    'D-1': 7, 'D-2': 7, 'D-3': 7, 'D-4': 7,
    'E-1': 1.5, 'E-2': 1.5, 'E-3': 1.5, 'E-4': 1.5, 'E-5': 1.5, 'E-6': 1.5,
    'F-1': 3, 'F-2': 1, 'F-3': 0.5, 'F-4': 3, 'F-5': 1, 'F-6': 0.5, 'F-7': 0.5, 'F-8': 1, 'F-9': 0.5, 'F-10': 3, 'F-11': 0.5,
    'G-4': 20, 'G-5': 20, 'G-6': 20,
    'H-1': 7, 'H-4': 7, 'H-5': 7, 'H-6': 7,
    'I-1': 10, 'I-2': 10, 'I-3': 10,
    'J-1': 30, 'J-2': 30, 'J-3': 30, 'J-4': 30,
    'L-1': 3, 'L-2': 10, 'L-3': 10,
    'M-2': 10, 'M-3': 10, 'M-5': 30, 'M-8': 30
  },
  dormitorio: ['A-1'],
  apartamento: ['A-2'],
  hospedagem: ['B-1', 'B-2'],
  alojamento: ['A-3', 'H-2'],
  leito: ['H-3'],
  vaga: ['G-1', 'G-2', 'G-3'],
  semCriterioDireto: ['M-1', 'M-4', 'M-6', 'M-7', 'M-9', 'N-1', 'N-2', 'N-3']
};
function configuracaoPopulacao(divisao) {
  if (COEFICIENTES_POPULACAO.semCriterioDireto.includes(divisao)) return { tipo: 'manual' };
  if (COEFICIENTES_POPULACAO.dormitorio.includes(divisao)) return { tipo: 'dormitorio' };
  if (COEFICIENTES_POPULACAO.apartamento.includes(divisao)) return { tipo: 'apartamento' };
  if (COEFICIENTES_POPULACAO.hospedagem.includes(divisao)) return { tipo: 'hospedagem' };
  if (COEFICIENTES_POPULACAO.alojamento.includes(divisao)) return { tipo: 'alojamento' };
  if (COEFICIENTES_POPULACAO.leito.includes(divisao)) return { tipo: 'leito' };
  if (COEFICIENTES_POPULACAO.vaga.includes(divisao)) return { tipo: 'vaga' };
  if (COEFICIENTES_POPULACAO.area[divisao]) return { tipo: 'area', coeficiente: COEFICIENTES_POPULACAO.area[divisao] };
  return { tipo: 'manual' };
}
function calcularPopulacaoReferencia(d) {
  const cfg = configuracaoPopulacao(d.divisao);
  const manual = motivo => ({ estado: 'revisao', motivo });
  if (d.divisao === 'F-7') return { estado: 'revisao', motivo: 'Eventos temporários seguem a NT-12 e a configuração de cada setor; use o público previsto informado na seção de evento.', publicoEvento: d.populacaoEvento };
  if (d.divisao === 'F-3') {
    if (d.tipoF3 === 'outro') return manual('Este tipo de recinto esportivo ou de espetáculo deve seguir a NT-12. A estimativa exige configuração por setor, não apenas a área.');
    if (d.tipoF3 !== 'ginasio') return manual('Confirme se é ginásio/piscina/academia/pista de patinação ou outro recinto esportivo; a norma aplicável depende desse enquadramento.');
    if (d.assentosF3 !== 'nao') return manual('Quando houver arquibancadas, assentos, bancos ou leiaute que define a população, é necessário informar e conferir a configuração em planta.');
  }
  if (d.divisao === 'F-5') return manual('Auditórios e espaços definidos por assentos não devem ser estimados apenas por área. Informe a configuração de assentos/leiaute para cálculo conforme a nota K da Tabela A1 da NT-11; a NT-12 complementa regras específicas de arquibancadas.');
  if (cfg.tipo === 'manual') return manual('A Tabela A1 da NT-11 não fornece um coeficiente direto aplicável a esta divisão; é necessária conferência técnica.');
  if (d.usoMisto) return manual('Há mais de uma atividade ou área com critérios diferentes. Separe os usos e calcule cada divisão; não é seguro combinar as áreas automaticamente.');
  if (d.areaEspecial) return manual('O local informou área com regra própria na NT-11. Separe essa área e aplique o critério correspondente com revisão técnica.');
  if (cfg.tipo === 'area') {
    if (!Number.isFinite(d.area) || d.area <= 0) return manual('Informe uma área construída total maior que zero para a estimativa simplificada.');
    const coef = d.divisao.startsWith('D-') && d.callcenter ? 1.5 : cfg.coeficiente;
    const total = Math.ceil(d.area / coef);
    if (d.divisao === 'F-3' && total >= 2500) return manual(total === 2500 ? 'A estimativa preliminar chegou a 2.500 pessoas. Confirme tecnicamente a regra aplicável.' : 'A estimativa preliminar supera 2.500 pessoas e requer análise conforme a NT-12 e o leiaute/setores.');
    return { estado: 'estimada', total, regra: 'Área construída total como referência simplificada', dados: `${d.area} m² informados`, fonte: 'Estimativa informativa simplificada; pode diferir do cálculo normativo.' };
  }
  if (cfg.tipo === 'apartamento' || cfg.tipo === 'hospedagem') {
    const quantidade = cfg.tipo === 'apartamento' ? d.apartamentosPorPavimento : d.hospedagensPorPavimento;
    const termo = cfg.tipo === 'apartamento' ? 'apartamentos' : 'quartos/unidades de hospedagem';
    if (!Number.isFinite(quantidade) || quantidade < 0) return manual(`Informe quantos ${termo} há por pavimento.`);
    if (quantidade === 0) return manual(`Foi informado zero ${termo}. Confirme se realmente não há unidades desse tipo nos pavimentos ocupados.`);
    if (!Number.isFinite(d.pavimentos) || d.pavimentos < 1) return manual('Informe o número de pavimentos.');
    const total = Math.ceil(quantidade * d.pavimentos * 2);
    return { estado: 'estimada', total, regra: `2 pessoas por ${cfg.tipo === 'apartamento' ? 'apartamento' : 'quarto/unidade de hospedagem'}`, dados: `${quantidade} por pavimento × ${d.pavimentos} pavimento(s)` };
  }
  if (cfg.tipo === 'dormitorio') {
    const pisos = Array.isArray(d.dadosPavimento) ? d.dadosPavimento : [];
    if (!pisos.length || pisos.some(p => !Number.isFinite(p.dormitorios) || p.dormitorios < 0)) return manual('Informe a quantidade de dormitórios por pavimento.');
    const total = pisos.reduce((s,p) => s + Math.ceil(p.dormitorios * 2), 0);
    return { estado: 'estimada', total, regra: '2 pessoas por dormitório', dados: `${pisos.length} pavimento(s) informado(s)` };
  }
  const pavimentos = Array.isArray(d.dadosPavimento) ? d.dadosPavimento : [];
  if (!pavimentos.length) return manual('Informe os dados coletivos de cada pavimento.');
  let total = 0;
  for (const p of pavimentos) {
    let pessoas = 0;
    if (cfg.tipo === 'alojamento') {
      if (![p.dormitorios,p.areaAlojamento].every(Number.isFinite) || p.dormitorios < 0 || p.areaAlojamento < 0) return manual('Informe por pavimento o número de dormitórios e a área útil de alojamento coletivo (dormitório coletivo com mais de 10 m²).');
      pessoas = p.dormitorios * 2 + p.areaAlojamento / 4;
    } else if (cfg.tipo === 'leito') {
      if (![p.leitos,p.areaAmbulatorio].every(Number.isFinite) || p.leitos < 0 || p.areaAmbulatorio < 0) return manual('Informe por pavimento o número de leitos e a área do ambulatório (use 0 quando não houver).');
      pessoas = p.leitos * 1.5 + p.areaAmbulatorio / 7;
    } else if (cfg.tipo === 'vaga') {
      if (!Number.isFinite(p.vagas) || p.vagas < 0) return manual('Informe por pavimento a quantidade de vagas para veículos.');
      pessoas = p.vagas / 40;
    } else {
      return manual('Este critério exige conferência profissional.');
    }
    // A população é apurada por pavimento; qualquer fração exige arredondamento para cima.
    total += Math.ceil(pessoas);
  }
  const regras = {
    alojamento: '2 pessoas por dormitório + 1 pessoa por 4 m² de alojamento coletivo',
    leito: '1,5 pessoa por leito + 1 pessoa por 7 m² de ambulatório',
    vaga: '1 pessoa por 40 vagas'
  };
  const regra = regras[cfg.tipo] || 'Critério coletivo';
  const dados = `${pavimentos.length} pavimento(s) informado(s)`;
  if (d.divisao === 'F-3' && total >= 2500) return manual(total === 2500 ? 'A estimativa preliminar chegou a 2.500 pessoas. A NT-12 admite a NT-11 para edificações permanentes com lotação inferior a 2.500; neste limite, encaminhamos para confirmação técnica.' : 'A estimativa preliminar é superior a 2.500 pessoas. A NT-11 direciona o caso à NT-12, que exige cálculo por setor e leiaute; este aplicativo não calcula a população final.');
  return { estado: 'estimada', total, regra, dados, fonte: 'NT-11/2025, item 5.3 e Tabela A1 do Anexo A; áreas especiais e notas aplicáveis precisam ser conferidas.' };
}
