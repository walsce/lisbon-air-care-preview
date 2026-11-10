(function(){
"use strict";
var menu=document.querySelector(".mobile-toggle"),nav=document.querySelector("#mobile-nav");
if(menu&&nav) menu.addEventListener("click",function(){var open=menu.getAttribute("aria-expanded")==="true";menu.setAttribute("aria-expanded",String(!open));nav.hidden=open;});
var quote=document.querySelector(".quote-layout");if(!quote)return;
var lang=quote.dataset.lang||"pt",en=lang==="en";
var labels={
  instalacao:[en?"Standard single-split installation (labour only)":"Instalação mono-split (só mão-de-obra)",299],
  manutencao:[en?"Basic maintenance per unit":"Manutenção básica por unidade",89],
  limpeza:[en?"Deep clean per unit":"Limpeza profunda por unidade",119],
  reparacao:[en?"Diagnostic visit before repair":"Visita de diagnóstico antes da reparação",49],
  diagnostico:[en?"Diagnostic visit":"Visita de diagnóstico",49],
  comercial:[en?"Commercial assessment visit":"Visita de avaliação comercial",49]
};
var tiers={lisboa:0,oeiras:0,amadora:0,odivelas:0,loures:0,cascais:15,sintra:15,almada:15,seixal:15,mafra:25,montijo:25,alcochete:25};
var get=function(id){return document.getElementById(id);};
var money=function(v){return new Intl.NumberFormat(en?"en-IE":"pt-PT",{style:"currency",currency:"EUR",maximumFractionDigits:2}).format(v);};
var last="";
function update(){
  var service=get("q-service").value;
  var units=Math.max(1,Math.min(10,parseInt(get("q-units").value,10)||1));
  var zone=get("q-zone").value;
  var name=get("q-zone").selectedOptions[0].textContent;
  var comp=get("q-complexity").value;
  var client=get("q-client").value;
  var row=labels[service]||labels.diagnostico;
  var count=(service==="diagnostico"||service==="reparacao"||service==="comercial")?1:units;
  var subtotal=row[1]*count,fee=tiers[zone]||0,total=subtotal+fee;
  var vat=total-total/1.23;
  var items=[
    {name:row[0],qty:count,unit:row[1],total:subtotal},
    {name:en?"Indicative travel fee":"Deslocação (provisória)",qty:1,unit:fee,total:fee}
  ];
  get("q-lines").innerHTML=items.map(function(item){return '<div class="line-row"><span>'+item.name+" × "+item.qty+'</span><strong>'+money(item.total)+'</strong></div>';}).join("");
  get("q-total").textContent=money(total);
  var extra=(service==="reparacao"||service==="comercial"||comp==="complex")?
    (en?"Extra work is NOT included and needs a written assessment.":"Trabalhos adicionais NÃO incluídos. Precisam de avaliação e preço escrito."):
    (en?"Equipment, extra electrical work and special access excluded.":"Equipamento, trabalho elétrico extra e acessos especiais excluídos.");
  get("q-extras").textContent=extra;
  last=(en?"LISBON AIR CARE — REFERENCE ESTIMATE":"LISBON AIR CARE — ESTIMATIVA INDICATIVA")+"\n"+
    (en?"Service: ":"Serviço: ")+row[0]+"\n"+
    (en?"Units: ":"Unidades: ")+units+"\n"+
    (en?"Municipality: ":"Concelho: ")+name+"\n"+
    (en?"Customer: ":"Cliente: ")+client+"\n"+
    (en?"Conditions: ":"Condições: ")+comp+"\n"+
    items.map(function(it){return it.name+" × "+it.qty+": "+money(it.total);}).join("\n")+"\n"+
    (en?"Total including VAT: ":"Total com IVA incluído: ")+money(total)+"\n"+
    (en?"Included VAT (23%): ":"IVA incluído (23%): ")+money(vat)+"\n"+
    extra+"\n"+
    (en?"Non-contractual indicative simulation; no data submitted.":"Simulação indicativa não contratual; nenhum dado enviado.");
}
["q-service","q-units","q-zone","q-complexity","q-client"].forEach(function(id){var x=get(id);if(x){x.addEventListener("change",update);x.addEventListener("input",update);}});
get("q-copy").addEventListener("click",function(){
  var status=get("q-status");
  if(navigator.clipboard&&window.isSecureContext){
    navigator.clipboard.writeText(last).then(function(){status.textContent=en?"Estimate copied.":"Resumo copiado.";},function(){status.textContent=en?"Clipboard blocked by browser; select the values above.":"Navegador bloqueou a cópia; selecione os valores acima.";});
  } else {
    var t=document.createElement("textarea");t.value=last;t.style.position="fixed";t.style.opacity="0";document.body.appendChild(t);t.select();
    try{document.execCommand("copy");status.textContent=en?"Estimate copied.":"Resumo copiado.";}catch(err){status.textContent=en?"Copy unavailable in this browser.":"Cópia indisponível neste navegador.";}t.remove();
  }
});
update();
})();