# Avaliação preliminar CBMGO

Aplicativo estático em HTML, CSS e JavaScript, sem bibliotecas ou serviços externos. Pode ser aberto localmente em navegador ou publicado em hospedagem estática com HTTPS.

## O que está incluído

- Tabelas 1, 5, 6A–6C, 6D, 6E, 6F.1–6F.5, 6G.1–6G.3, 6H.1–6H.3, 6I.1–6I.2, 6J.1–6J.2 e 6M.1–6M.6 do Anexo A enviado.
- Tabelas 7 e 8, classificação de altura, estimativa condicional da população de referência conforme NT-11/2025 e triagem de processo administrativo.
- Resultados resumidos: nas Tabelas 6, marcações X sem nota são exigências diretas; X com nota é avaliado segundo suas condições. Recomendações permanecem identificadas como recomendações; requisitos dependentes de informações ausentes são sinalizados para conferência, não presumidos.
- Para J-2/J-3/J-4, a área construída total e a área efetivamente destinada ao depósito são informações diferentes. A área construída seleciona condições da matriz; a área do depósito apoia a análise de notas sobre armazenamento/garagem. Em J-4, informe também a área da garagem interna (0 se não houver; deixe em branco se não souber).
- Para a Tabela 6C, os dados de área de depósito, área de garagem interna e altura dos expositores permitem aplicar as condições das notas 1, 7, 8, 9, 10 e 11 conforme o caso.
- A Tabela 6M.2 contém uma célula com “?” no material extraído, correspondente a uma célula em branco/indeterminada no PDF: o aplicativo não presume exigência ou dispensa.

## Estimativa de população

- A estimativa aparece junto à área construída. Nas divisões calculadas por área, usa-se a área construída total como referência simplificada e informativa.
- A-1: dormitórios informados por pavimento, com 2 pessoas por dormitório. A-2: quantidade de apartamentos por pavimento × pavimentos × 2 pessoas. B-1/B-2: quantidade de quartos/unidades de hospedagem por pavimento × pavimentos × 2 pessoas.
- A-3/H-2 preservam o critério coletivo, com dormitórios e área de alojamento informados por pavimento; H-3 e grupos G-1 a G-3 mantêm leitos/ambulatório e vagas, respectivamente.
- O aplicativo coleta os dados necessários em campos separados para cada pavimento e arredonda a população por pavimento. Cozinhas e áreas de apoio são informadas separadamente (1 pessoa por 7 m²), sem presumir dados ausentes. Uso misto, áreas com regra especial, eventos F-7 e divisões sem coeficiente direto seguem para conferência, sem estimativa automática.
- Em F-3, o cálculo só aparece após identificar ginásio/piscina/academia/pista de patinação e declarar ausência de assentos/leiaute determinante; outros recintos e configurações seguem para conferência. Resultados de 2.500 pessoas ou mais são encaminhados para revisão da aplicação da NT-12 e do leiaute/setores.
- A estimativa é informativa e não é lotação autorizada; não substitui análise profissional. A simplificação pode diferir do cálculo normativo por atividade, pavimento e área efetivamente considerada. O valor estimado não é reutilizado automaticamente nas regras administrativas da NT-01; sem a lotação aprovada, o processo administrativo é apresentado como a confirmar.
- A estimativa é preliminar e deve ser cotejada com as notas da Tabela A1 e com a norma oficial vigente por profissional habilitado. A coleta de pavimentos deve corresponder apenas aos pisos onde aquela atividade ocorre; revise os dados ao trocar de atividade.

## Como executar localmente

1. Extraia a pasta mantendo sua estrutura.
2. Abra `index.html` em um navegador moderno.
3. Siga as três etapas do formulário: atividade, edificação e condições específicas. Use **Continuar** e **Voltar**; campos exigidos são validados antes de avançar.
4. Para salvar a avaliação, use a impressão do navegador e escolha “Salvar como PDF”.

## Publicar e ativar no site

1. Envie a pasta completa para uma hospedagem de site estático com HTTPS. Mantenha `index.html`, `css/` e `js/` nos mesmos locais.
2. No GitHub Pages, crie um repositório, envie o conteúdo mantendo nomes e subpastas e habilite Pages nas configurações do repositório. Aguarde o endereço de publicação indicado pela plataforma.
3. Abra o endereço em celular e computador. Faça uma avaliação de teste e confirme que formulário, estilos e scripts carregam.
4. Para exibir dentro de outra página, hospede o aplicativo separadamente e incorpore a URL em um `iframe` com `title` descritivo, `loading="lazy"` e `sandbox="allow-scripts"`. Confira a altura em telas pequenas.
5. Ao atualizar o site, substitua a versão completa e teste o endereço publicado novamente.

## Segurança e privacidade

O aplicativo processa os campos no próprio navegador e não necessita de login, banco de dados, chaves secretas ou integrações externas. Não acrescente senhas ou tokens ao código público; evite scripts e analytics externos sem revisão de privacidade e publique apenas em HTTPS. Não use os campos para dados pessoais ou sensíveis de clientes; considere também extensões, dispositivos compartilhados e as práticas do serviço de hospedagem.

## Aviso normativo

A saída é **exclusivamente orientativa** e não declara conformidade. As tabelas foram transcritas dos documentos enviados e devem ser cotejadas por profissional habilitado com a publicação oficial vigente, inclusive em futuras revisões normativas. A ferramenta não substitui a análise técnica do CBMGO nem a responsabilidade profissional (item 2.1.1 da NT 01/2026).
