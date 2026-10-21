const AVISO_LEGAL="Resultado exclusivamente orientativo. Não substitui a análise técnica do CBMGO nem a responsabilidade do profissional habilitado (item 2.1.1 da NT 01/2026).";
const nomesMedidas={controleMateriaisAcabamento:"Controle de materiais de acabamento e revestimento",saidasEmergencia:"Saídas de emergência",iluminacaoEmergencia:"Iluminação de emergência",sinalizacaoEmergencia:"Sinalização de emergência",extintores:"Extintores",centralGas:"Central de GLP"};
function formatarNomeMedida(chave){return nomesMedidas[chave]||String(chave).replace(/([A-Z])/g," $1").replace(/^./,x=>x.toUpperCase());}
function valor(id){return document.getElementById(id)?.value||"";}
function coletarEstabelecimento(form){const f=new FormData(form);const checked=n=>f.has(n);const num=(root,id)=>{const el=root.querySelector(`[data-campo="${id}"]`);return !el||el.value===""?NaN:Number(el.value);};const divisao=valor("divisao");const dadosPavimento=Array.from(document.querySelectorAll("[data-dados-pavimento]")).map(root=>({area:num(root,"area"),areaApoio:num(root,"areaApoio"),dormitorios:num(root,"dormitorios"),salas:num(root,"salas"),gabinetes:num(root,"gabinetes"),outrasDependencias:num(root,"outrasDependencias"),ambientesAdicionais:num(root,"ambientesAdicionais"),areaAlojamento:num(root,"areaAlojamento"),leitos:num(root,"leitos"),areaAmbulatorio:num(root,"areaAmbulatorio"),vagas:num(root,"vagas")}));const somaCampo=chave=>dadosPavimento.reduce((s,p)=>s+(Number.isFinite(p[chave])?p[chave]:0),0);const dados={divisao,apartamentosPorPavimento:valor("apartamentosPorPavimento")===""?NaN:Number(valor("apartamentosPorPavimento")),hospedagensPorPavimento:valor("hospedagensPorPavimento")===""?NaN:Number(valor("hospedagensPorPavimento")),tipoF3:valor("tipoF3"),assentosF3:valor("assentosF3"),area:Number(valor("area")),altura:valor("altura")===""?null:Number(valor("altura")),pavimentos:Number(valor("pavimentos")),lotacao:divisao==="F-7"&&valor("publicoEvento")!==""?Number(valor("publicoEvento")):null,dadosPavimento,areasPavimento:dadosPavimento.map(p=>p.area),areasCozinhaPavimento:dadosPavimento.map(p=>p.areaApoio),qtdDormitorios:somaCampo("dormitorios"),qtdAmbientesAdicionais:somaCampo("ambientesAdicionais"),areaAlojamento:somaCampo("areaAlojamento"),qtdLeitos:somaCampo("leitos"),areaAmbulatorio:somaCampo("areaAmbulatorio"),qtdVagas:somaCampo("vagas"),callcenter:valor("callcenter")==="sim",usoMisto:document.getElementById("usoMisto")?.checked||false,areaEspecial:document.getElementById("areaEspecial")?.checked||false,dataConstrucao:valor("dataConstrucao"),mudancaRisco:valor("mudancaRisco"),areaSubsolo:Number(valor("areaSubsolo")),areaGaragemInterna:valor("areaGaragemInterna")===""?null:Number(valor("areaGaragemInterna")),areaDeposito:valor("areaDeposito")===""?null:Number(valor("areaDeposito")),alturaExpositores:valor("alturaExpositores")===""?null:Number(valor("alturaExpositores")),usoSubsolo:valor("usoSubsolo"),nivelSubsolo:Number(valor("nivelSubsolo")),areaDeposito:valor("areaDeposito")===""?null:Number(valor("areaDeposito")),glpKg:Number(valor("glpKg")),liquidosLitros:Number(valor("liquidosLitros")),cozinhaProfissional:checked("cozinhaProfissional"),produtosPerigosos:checked("produtosPerigosos"),armazenamento:checked("armazenamento"),fotovoltaico:checked("fotovoltaico"),recargaVeiculos:checked("recargaVeiculos"),comercializaGLP:checked("comercializaGLP"),isolamentoRiscoNecessario:checked("isolamentoRiscoNecessario"),atividadeResidencialSemRecepcao:checked("atividadeResidencialSemRecepcao"),outrasAtividadesOutroRisco:checked("outrasAtividadesOutroRisco"),aberturasEdificacoesAdjacentes:checked("aberturasEdificacoesAdjacentes"),areaComumEdificioComExcecao:checked("areaComumEdificioComExcecao"),explosivos:checked("explosivos"),caldeiras:checked("caldeiras"),primeiroLicenciamentoShopping:checked("primeiroLicenciamentoShopping"),areaEvento:Number(valor("areaEvento")),comprimentoTunel:valor("comprimentoTunel")===""?null:Number(valor("comprimentoTunel")),categoriaM2:valor("categoriaM2")===""?null:Number(valor("categoriaM2")),publicoEvento:Number(valor("publicoEvento")),diasEvento:Number(valor("diasEvento")),alturaEstrutura:Number(valor("alturaEstrutura")),areaPrivativaPublico:Number(valor("areaPrivativaPublico")),eventoAreaPublicaAberta:checked("eventoAreaPublicaAberta"),eventoTemCamarote:checked("eventoTemCamarote"),eventoEstruturaFechada:checked("eventoEstruturaFechada"),eventoEstrutura:checked("eventoEstrutura")};if(divisao==="F-7")dados.populacaoEvento=Number(valor("publicoEvento"));return dados;}
function escapar(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function bloco(titulo,conteudo,classe=""){return `<article class="card ${classe}"><h2>${escapar(titulo)}</h2>${conteudo}</article>`;}
function textoAmigavelNota(texto){return String(texto||"").replace(/^Nota geral [a-z]:\s*/i,"").replace(/área total construída/gi,"área total do prédio").replace(/garagens internas/gi,"garagens dentro do prédio").replace(/sistema de chuveiros automáticos/gi,"chuveiros automáticos").replace(/m 2/g,"m²").trim();}
function renderizarResultado(d){
 const occ=TABELA_1[d.divisao]||"Ocupação não mapeada",cl=d.altura===null?{codigo:"?",nome:"Altura não informada",descricao:""}:classificarAltura(d.altura,d.pavimentos),base=definirBaseAplicavel(d.divisao,d.area,d.altura),t6=base==="Tabela 6";
 let conteudo="",pendentes=0;
 if(t6){
  const x=obterMedidasTabela6(d.divisao,d.altura,d.pavimentos,d);pendentes=x.medidasIndeterminadas||0;
  conteudo=x.pendente?`<p class="notice-inline"><strong>Falta uma informação:</strong> ${escapar(x.observacao)}</p>`:`<p class="help">Tabela ${escapar(x.tabela)} · coluna “${escapar(x.coluna||"")}”.</p>`;
  if(x.medidas?.length)conteudo+=`<ul class="medidas-resumo">${x.medidas.map(m=>`<li><strong>${escapar(m.nome)}</strong> <span class="pill ${m.recomendatoria?"pill--recommendation":""}">${m.recomendatoria?"Recomendação":"Indicada na tabela"}</span>${m.condicoes?.length?`<details><summary>Ver condição da nota</summary><ul>${m.condicoes.map(n=>`<li>${escapar(textoAmigavelNota(n))}</li>`).join("")}</ul></details>`:""}</li>`).join("")}</ul>`;
  if(pendentes)conteudo+=`<p class="notice-inline"><strong>Conferência necessária:</strong> alguns itens com X dependem de dados adicionais. ${d.divisao.startsWith("J-")&&!(Number.isFinite(d.areaDeposito)&&Number.isFinite(d.areaGaragemInterna))?"Informe as áreas do depósito e das garagens internas (0 se não houver) para avaliar as notas aplicáveis; enquanto isso, confirme esses itens com profissional habilitado.":"Não foram apresentados como exigidos nem dispensados; confirme as notas e características do local com profissional habilitado."}</p>`;
  if(!x.pendente&&!x.medidas?.length&&!pendentes)conteudo+=`<p>Não há medida com X confirmada para os dados informados. Isso não significa dispensa; confira a tabela oficial e o projeto.</p>`;
  if(d.divisao.startsWith("C-")){const a=obterAlertasTabela6C(d);if(a.length)conteudo+=`<ul class="alerta">${a.map(i=>`<li>${escapar(textoAmigavelNota(i.texto))}</li>`).join("")}</ul>`;}
 }else{
  const todasMedidas=TABELA_5.obterMedidas(d.divisao,d)||[];const ms=todasMedidas.filter(m=>m.estado==="exigida"&&m.aplicavel!==false);
  conteudo=ms.length?`<ul class="medidas-resumo">${ms.map(m=>`<li><strong>${escapar(formatarNomeMedida(m.chave))}</strong>${m.nota?`<details><summary>Ver condição da nota</summary><p>${escapar(textoAmigavelNota(m.nota))}</p></details>`:""}</li>`).join("")}</ul>`:`<p>Não há medida com X confirmada para os dados preenchidos. Confira as condições da Tabela 5; isso não significa dispensa.</p>`;
  if(todasMedidas.some(m=>m.estado==="indeterminada"))conteudo+=`<p class="notice-inline"><strong>Conferência necessária:</strong> a nota da Tabela 5 vinculada à lotação não pôde ser avaliada, pois a população calculada pela NT-11 não substitui automaticamente a lotação aprovada para fins administrativos.</p>`;
 }
 let html=bloco("Resumo da edificação",`<p><strong>Atividade:</strong> ${escapar(d.divisao)} — ${escapar(occ)}</p><p><strong>Área construída total:</strong> ${d.area} m² · <strong>altura:</strong> ${d.altura} m · <strong>pavimentos:</strong> ${d.pavimentos}</p><p><strong>Referência:</strong> ${escapar(base)} · ${escapar(cl.nome)}.</p>`);
 const pop=calcularPopulacaoReferencia(d);
 const textoReferenciaPopulacao="Se trata de uma simplificação como referência de população e pode diferir do cálculo normativo por atividade, pavimento e área efetivamente considerada. Não é lotação autorizada nem substitui a análise profissional.";
 const popHtml=pop.estado==="revisao"&&d.divisao==="F-7"?`<p class="help">${textoReferenciaPopulacao}</p><p><strong>Público previsto informado: ${Number.isFinite(pop.publicoEvento)?pop.publicoEvento:"não informado"} pessoas.</strong></p><p>${escapar(pop.motivo)}</p><p class="help">Esse valor é uma previsão do evento, não uma aprovação de lotação. A NT-12 exige análise dos setores, assentos, arquibancadas, áreas de público em pé ou camarotes; circulação e rotas de saída não entram na área de público.</p>`:pop.estado==="estimada"?`<p class="help">${textoReferenciaPopulacao}</p><p><strong>População de referência: ${pop.total} pessoas.</strong></p>`:`<p class="help">${textoReferenciaPopulacao}</p><p><strong>Não foi possível calcular automaticamente.</strong> ${escapar(pop.motivo)}</p>`;
 if(pop.estado==="estimada"||["F-3","F-5","F-7"].includes(d.divisao))html+=bloco("População de referência para dimensionamento das saídas",popHtml,pop.estado==="estimada"?"card--green":"card--orange");
 const mensagemWhatsApp="Olá, encontrei seu contato pelo aplicativo e gostaria de conversar sobre uma avaliação profissional";
 const linkWhatsApp=`https://wa.me/5564999829979?text=${encodeURIComponent(mensagemWhatsApp)}`;
 conteudo+=`<div class="contact-cta"><p>Precisa de ajuda para avaliar o seu estabelecimento?</p><a class="button button--whatsapp" href="${linkWhatsApp}" target="_blank" rel="noopener noreferrer">Entre em contato com um profissional</a></div>`;
 html+=bloco("Medidas indicadas",conteudo,"card--green");
 const sub=avaliarSubsolo(d);if(sub)html+=bloco("Se há subsolo",`<p>${escapar(sub.observacao)}</p><ul>${sub.medidas.map(m=>`<li>${escapar(textoAmigavelNota(m))}</li>`).join("")}</ul><p class="help">A Tabela 7 apresenta opções alternativas; elas não devem ser somadas automaticamente.</p>`,"card--orange");
 const riscos=avaliarRiscosEspecificos(d);if(riscos.length)html+=bloco("Outros riscos informados",`<ul>${riscos.map(x=>`<li><strong>${escapar(x.rotulo)}</strong> — confira ${escapar(x.norma)}.</li>`).join("")}</ul>`,"card--orange");
 const pr=definirProcesso(d);html+=bloco("Etapa administrativa provável",`<p><strong>${escapar(pr.titulo)}</strong></p><p>${escapar(pr.observacao)}</p><details><summary>Referência normativa</summary><p>${escapar(pr.base)}</p></details>`,"card--orange");
 if(d.dataConstrucao&&new Date(`${d.dataConstrucao}T00:00:00`)<new Date("2007-03-10T00:00:00"))html+=bloco("Atenção à data da edificação",`<p>A data informada é anterior a 10/03/2007. Confirme com o CBMGO se a NT-41 se aplica.</p>`,"alerta");
 html+=bloco("Importante",`<p>${AVISO_LEGAL}</p><p>São mostradas apenas marcações X com condições compatíveis com as informações preenchidas. Se faltarem dados, não se presume exigência nem dispensa; confira a publicação oficial e procure profissional habilitado.</p>`,"alerta");
 return html;
}
document.addEventListener("DOMContentLoaded",()=>{
 const formulario=document.getElementById("formulario");
 formulario.noValidate=true;
 const camposFormulario=Array.from(formulario.children).filter(el=>el.matches("fieldset"));
 const botaoAvaliar=formulario.querySelector('button[type="submit"]');
 const gruposEtapas=[
   {titulo:"Atividade",descricao:"Escolha a atividade e informe a identificação básica.",campos:[camposFormulario[0]]},
   {titulo:"Edificação",descricao:"Informe a área construída, a altura e, quando aplicável, os dados de população de referência.",campos:[camposFormulario[1],document.getElementById("populacaoFieldset")]},
   {titulo:"Condições específicas",descricao:"Revise subsolo, riscos, instalações e dados de evento antes de avaliar.",campos:[...camposFormulario.slice(3)]}
 ];
 const controlesEtapas=document.createElement("nav");controlesEtapas.className="wizard";controlesEtapas.setAttribute("aria-label","Progresso do preenchimento");
 controlesEtapas.innerHTML=`<ol class="wizard__steps">${gruposEtapas.map((s,i)=>`<li><span class="wizard__number">${i+1}</span><span class="wizard__title">${s.titulo}</span></li>`).join("")}</ol><p class="wizard__status" aria-live="polite"></p>`;
 formulario.before(controlesEtapas);
 const referenciaInicial=camposFormulario[0];
 const paineis=gruposEtapas.map((etapa,i)=>{const painel=document.createElement("section");painel.className="wizard__panel";painel.dataset.step=String(i);painel.setAttribute("aria-label",`Etapa ${i+1}: ${etapa.titulo}`);painel.innerHTML=`<p class="wizard__intro">${etapa.descricao}</p>`;formulario.insertBefore(painel,referenciaInicial);return painel;});
 gruposEtapas.forEach((etapa,i)=>etapa.campos.filter(Boolean).forEach(campo=>paineis[i].appendChild(campo)));
 formulario.append(...paineis);
 paineis.forEach((painel,i)=>{const barra=document.createElement("div");barra.className="wizard__actions";barra.innerHTML=`<button type="button" class="button button--secondary wizard__back" ${i===0?"disabled":""}>Voltar</button>${i<gruposEtapas.length-1?'<button type="button" class="button wizard__next">Continuar</button>':''}`;if(i===2&&botaoAvaliar)barra.appendChild(botaoAvaliar);painel.appendChild(barra);});
 let etapaAtual=0;
 function mostrarEtapa(indice){etapaAtual=Math.max(0,Math.min(indice,paineis.length-1));paineis.forEach((painel,i)=>{painel.hidden=i!==etapaAtual;});Array.from(controlesEtapas.querySelectorAll("li")).forEach((li,i)=>{if(i===etapaAtual)li.setAttribute("aria-current","step");else li.removeAttribute("aria-current");li.classList.toggle("is-complete",i<etapaAtual);});controlesEtapas.querySelector(".wizard__status").textContent=`Etapa ${etapaAtual+1} de ${paineis.length}: ${gruposEtapas[etapaAtual].titulo}`;const foco=paineis[etapaAtual].querySelector('input:not([disabled]),select:not([disabled]),button:not([disabled])');foco?.focus({preventScroll:true});}
 function campoInvalido(painel){return Array.from(painel.querySelectorAll("input,select,textarea")).find(el=>el.required&&!el.disabled&&el.getClientRects().length>0&&el.closest('fieldset')?.hidden!==true&&!el.checkValidity());}
 paineis.forEach((painel,i)=>{painel.querySelector(".wizard__back")?.addEventListener("click",()=>mostrarEtapa(i-1));painel.querySelector(".wizard__next")?.addEventListener("click",()=>{const invalido=campoInvalido(painel);if(invalido){invalido.reportValidity();invalido.focus();return;}mostrarEtapa(i+1);});});
 const select=document.getElementById("divisao"),fieldset=document.getElementById("eventoFieldset"),especiais=document.getElementById("camposEspeciaisFieldset"),tunel=document.getElementById("campoTunel"),m2=document.getElementById("campoM2");
 for(const [codigo,descricao] of Object.entries(TABELA_1)){const opt=document.createElement("option");opt.value=codigo;opt.textContent=`${descricao} (${codigo})`;select.appendChild(opt);}
 const areaBox=document.getElementById("populacaoAreas"),avisoManual=document.getElementById("avisoManualPopulacao"),listaDados=document.getElementById("listaDadosPopulacaoPavimento");
 let nDadosPav=0;
 const tiposPorCampo={
   area:["area"],areaApoio:["area"],dormitorios:["dormitorio","alojamento"],salas:[],gabinetes:[],outrasDependencias:[],
   areaAlojamento:["alojamento"],leitos:["leito"],areaAmbulatorio:["leito"],vagas:["vaga"]
 };
 const rotulos={area:"Área da atividade neste pavimento (m²)",areaApoio:"Área de cozinha e apoio neste pavimento (m²)",dormitorios:"Número de dormitórios",salas:"Número de salas",gabinetes:"Número de gabinetes",outrasDependencias:"Número de outras dependências",areaAlojamento:"Área útil de alojamento coletivo neste pavimento (m²)",leitos:"Número de leitos neste pavimento",areaAmbulatorio:"Área de ambulatório neste pavimento (m²); 0 se não houver",vagas:"Número de vagas neste pavimento"};
 function adicionarDadosPavimento(){
   nDadosPav++;
   const root=document.createElement("section");root.className="dados-pavimento";root.dataset.dadosPavimento="";
   const campo=id=>`<div class="campo-pavimento campo-${id}" hidden><label for="${id}${nDadosPav}">${rotulos[id]}</label><input id="${id}${nDadosPav}" data-campo="${id}" type="number" min="0" step="${id.startsWith("area")?"0.01":"1"}"></div>`;
   root.innerHTML=`<div class="dados-pavimento__titulo"><strong>Pavimento ${nDadosPav}</strong>${nDadosPav>1?'<button type="button" class="button button--secondary remover-dados-pavimento">Remover</button>':''}</div><div class="grid grid--2">${Object.keys(rotulos).map(id=>campo(id).replace(`min="0" step="${id.startsWith("area")?"0.01":"1"}"`,`min="${id==="area"?"0.01":"0"}" step="${id.startsWith("area")?"0.01":"1"}"`)).join("")}</div>`;
   root.querySelector(".remover-dados-pavimento")?.addEventListener("click",()=>{if(listaDados.children.length>1){root.remove();Array.from(listaDados.children).forEach((el,i)=>el.querySelector("strong").textContent=`Pavimento ${i+1}`);}});
   listaDados.appendChild(root);atualizarCampos();
 }
 document.getElementById("adicionarDadosPavimento").addEventListener("click",adicionarDadosPavimento);
 const atualizarCampos=()=>{
   const div=select.value,cfg=div?configuracaoPopulacao(div):{tipo:"manual"};
   fieldset.hidden=div!=="F-7";tunel.hidden=div!=="M-1";m2.hidden=div!=="M-2";especiais.hidden=!['M-1','M-2'].includes(div);
   document.getElementById("avisoF3").hidden=div!=="F-3";document.getElementById("tipoF3").required=div==="F-3";document.getElementById("tipoF3").disabled=div!=="F-3";document.getElementById("assentosF3").required=div==="F-3";document.getElementById("assentosF3").disabled=div!=="F-3";document.getElementById("avisoF7").hidden=div!=="F-7";
   const tipoCampos=div==="F-3"?(valor("tipoF3")==="ginasio"&&valor("assentosF3")==="nao"?"area":"manual"):div==="F-5"?"manual":cfg.tipo;
   const calculaAutomatico=tipoCampos!=="manual"&&div!=="F-7";
   document.getElementById("populacaoFieldset").hidden=!(calculaAutomatico||["F-3","F-5","F-7"].includes(div));
   document.getElementById("areaEvento").disabled=div!=="F-7";
   areaBox.hidden=!calculaAutomatico;
   const camposUnidades=document.getElementById("camposUnidades"),campoApartamentos=document.getElementById("campoApartamentos"),campoHospedagens=document.getElementById("campoHospedagens");
   const usaApartamentos=div==="A-2",usaHospedagens=["B-1","B-2"].includes(div);
   camposUnidades.hidden=!(usaApartamentos||usaHospedagens);campoApartamentos.hidden=!usaApartamentos;campoHospedagens.hidden=!usaHospedagens;
   document.getElementById("apartamentosPorPavimento").disabled=!usaApartamentos;document.getElementById("apartamentosPorPavimento").required=usaApartamentos;
   document.getElementById("hospedagensPorPavimento").disabled=!usaHospedagens;document.getElementById("hospedagensPorPavimento").required=usaHospedagens;
   const usaDadosColetivos=calculaAutomatico&&["dormitorio","alojamento","leito","vaga"].includes(tipoCampos);
   listaDados.hidden=!usaDadosColetivos;document.getElementById("tituloDadosPopulacao").hidden=!usaDadosColetivos;document.getElementById("adicionarDadosPavimento").hidden=!usaDadosColetivos;document.getElementById("ajudaAreasPopulacao").hidden=!usaDadosColetivos;
   listaDados.querySelectorAll("[data-dados-pavimento]").forEach(root=>{
     for(const [id,tipos] of Object.entries(tiposPorCampo)){
       const wrap=root.querySelector(`.campo-${id}`),input=root.querySelector(`[data-campo="${id}"]`),ativo=usaDadosColetivos&&tipos.includes(tipoCampos);
       wrap.hidden=!ativo;input.disabled=!ativo;input.required=ativo;
     }
   });
   const ajuda=document.getElementById("ajudaAreasPopulacao");
   if(tipoCampos==="area")ajuda.textContent="A estimativa simplificada usa a área construída total informada nesta etapa, uma única vez, como referência. A área efetivamente aplicável pode ser diferente na análise profissional.";
   else if(tipoCampos==="dormitorio")ajuda.textContent="Informe o número de dormitórios em cada pavimento ocupado pela atividade.";
   else if(tipoCampos==="alojamento")ajuda.textContent="Informe dormitórios e a área útil de alojamento coletivo por pavimento. A norma define alojamento coletivo como dormitório coletivo com mais de 10 m².";
   else if(tipoCampos==="leito")ajuda.textContent="Informe leitos e área ambulatorial por pavimento; se não houver ambulatório, informe 0.";
   else if(tipoCampos==="vaga")ajuda.textContent="Informe a quantidade de vagas por pavimento.";
   else if(!usaDadosColetivos)ajuda.textContent="Informe somente os dados específicos necessários para esta atividade.";
   document.getElementById("campoCallcenter").hidden=!div.startsWith("D-")||!calculaAutomatico;document.getElementById("campoCallcenter").querySelector("select").disabled=!div.startsWith("D-")||!calculaAutomatico;
   document.getElementById("campoUsoMisto").hidden=!calculaAutomatico||div==="F-3";document.getElementById("usoMisto").disabled=document.getElementById("campoUsoMisto").hidden;
   document.getElementById("campoAreaEspecial").hidden=!calculaAutomatico||div==="F-3";document.getElementById("areaEspecial").disabled=document.getElementById("campoAreaEspecial").hidden;
   document.getElementById("area").required=!(["F-7","M-1"].includes(div));document.getElementById("area").disabled=div==="M-1";
   document.getElementById("publicoEvento").required=div==="F-7";document.getElementById("publicoEvento").disabled=div!=="F-7";document.getElementById("altura").required=div!=="M-1";document.getElementById("altura").disabled=div==="M-1";
   document.getElementById("campoTunel").querySelector("input").required=div==="M-1";document.getElementById("campoTunel").querySelector("input").disabled=div!=="M-1";
   document.getElementById("campoM2").querySelector("select").required=div==="M-2";document.getElementById("campoM2").querySelector("select").disabled=div!=="M-2";
   if(div==="F-3"){avisoManual.hidden=false;avisoManual.textContent="A estimativa pela NT-11 só aparece para ginásio, piscina, academia ou pista de patinação sem assentos/leiaute determinante. Informe a área coberta total por pavimento, incluindo pistas e recintos abrangidos. Arquibancadas, bancos, outros recintos ou lotação igual/superior ao limite exigem conferência específica da NT-12.";}
   else if(div==="F-5"){avisoManual.hidden=false;avisoManual.textContent="Em auditórios e espaços cuja população depende de assentos, é necessária conferência do leiaute em planta; a NT-12 complementa apenas regras específicas de arquibancadas.";}
   else if(cfg.tipo==="manual"&&div!=="F-7"){avisoManual.hidden=false;avisoManual.textContent="Para esta atividade, a NT-11 não traz um critério direto na Tabela A1. A análise deve considerar o uso real e as normas específicas.";}
   else avisoManual.hidden=true;
 };
 document.getElementById("tipoF3").addEventListener("change",atualizarCampos);
 document.getElementById("assentosF3").addEventListener("change",atualizarCampos);
 adicionarDadosPavimento();
 select.addEventListener("change",()=>{while(listaDados.children.length>1)listaDados.lastElementChild.remove();nDadosPav=1;listaDados.querySelectorAll("input").forEach(i=>{i.value="";});atualizarCampos();});atualizarCampos();mostrarEtapa(0);
 formulario.addEventListener("invalid",event=>{
   const campo=event.target;
   if(campo.validity.valueMissing)campo.setCustomValidity("Este campo é obrigatório.");
   else if(campo.validity.rangeUnderflow)campo.setCustomValidity(`Informe um valor maior ou igual a ${campo.min}.`);
   else if(campo.validity.rangeOverflow)campo.setCustomValidity(`Informe um valor menor ou igual a ${campo.max}.`);
   else if(campo.validity.stepMismatch)campo.setCustomValidity("Informe um valor válido para este campo.");
   else campo.setCustomValidity("Confira o valor informado.");
 },true);
 formulario.addEventListener("input",event=>event.target.setCustomValidity(""));
 formulario.addEventListener("change",event=>event.target.setCustomValidity(""));
 formulario.addEventListener("submit",event=>{event.preventDefault();const invalido=Array.from(formulario.querySelectorAll("input,select,textarea")).find(el=>el.required&&!el.disabled&&el.getClientRects().length>0&&el.closest('fieldset')?.hidden!==true&&!el.checkValidity());if(invalido){const painel=invalido.closest(".wizard__panel"),indice=paineis.indexOf(painel);if(indice>=0)mostrarEtapa(indice);invalido.reportValidity();invalido.focus();return;}const estabelecimento=coletarEstabelecimento(event.currentTarget);const resultado=document.getElementById("resultado");resultado.innerHTML=renderizarResultado(estabelecimento);resultado.scrollIntoView({behavior:"smooth",block:"start"});});
});
