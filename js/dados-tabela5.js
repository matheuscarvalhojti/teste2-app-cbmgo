/* Tabela 5 – Anexo A da NT 01/2026. “X” é exigência; notas condicionam sua aplicação. */
const TABELA_5 = {
  colunas:{A1CDEG:["A-1","C-1","C-2","C-3","D-1","D-2","D-3","D-4","E-1","E-2","E-3","E-4","E-5","E-6","G-1","G-2","G-3","G-4","G-5","G-6"],B:["B-1","B-2"],F_grupo1:["F-1","F-2","F-3","F-5","F-6","F-7","F-11"],F_grupo2:["F-4","F-8","F-9","F-10"],H_145:["H-1","H-4","H-5"],H_23:["H-2","H-3"],IJ:["I-1","I-2","I-3","J-1","J-2","J-3","J-4"],L1:["L-1"]},
  medidas:{
    controleMateriaisAcabamento:{A1CDEG:{valor:false},B:{valor:true,nota:2},F_grupo1:{valor:true,nota:2},F_grupo2:{valor:false},H_145:{valor:false},H_23:{valor:true,nota:2},IJ:{valor:false},L1:{valor:true}},
    saidasEmergencia:{todas:{valor:true}},
    iluminacaoEmergencia:{A1CDEG:{valor:true,nota:3},B:{valor:true},F_grupo1:{valor:true,nota:3},F_grupo2:{valor:true,nota:3},H_145:{valor:true,nota:3},H_23:{valor:true,nota:3},IJ:{valor:true,nota:3},L1:{valor:false}},
    sinalizacaoEmergencia:{todas:{valor:true}},extintores:{todas:{valor:true}},centralGas:{todas:{valor:true,nota:4}}
  },
  notas:{1:"Para A-1, aplica-se às áreas e edificações de uso comum; condomínios/loteamentos devem possuir acesso para viaturas e hidrante urbano conforme NT-06 e NT-34.",2:"Para edificações com área total construída igual ou superior a 200 m².",3:"Para edificação com lotação superior a 50 pessoas ou com mais de dois pavimentos.",4:"Central de GLP dispensada quando permitido recipiente de 32 L (13 kg), conforme NT-28."},
  obterColuna(divisao){return Object.keys(this.colunas).find(k=>this.colunas[k].includes(divisao))||null;},
  obterMedidas(divisao,dados={}){const coluna=this.obterColuna(divisao);if(!coluna)return null;return Object.entries(this.medidas).map(([chave,porColuna])=>{let regra=porColuna[coluna]||porColuna.todas||{valor:false};let estado=regra.valor===true?"exigida":regra.valor===false?"naoExigida":"condicional";let aplicavel=regra.valor===true;if(regra.nota===2)aplicavel=Number(dados.area)>=200;if(regra.nota===3){if(dados.lotacao===null||dados.lotacao===undefined)estado="indeterminada";else aplicavel=Number(dados.lotacao)>50||Number(dados.pavimentos)>2;}if(regra.nota===4)aplicavel=Number(dados.glpKg)>0;return {chave,estado:estado==="indeterminada"?estado:(regra.nota&&!aplicavel?"naoExigida":estado),nota:regra.nota?this.notas[regra.nota]:"",aplicavel};});}
};
