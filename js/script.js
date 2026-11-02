(function () {
  const caixa = document.getElementById('contagem');
  if (!caixa) return;

  const alvo = new Date(caixa.dataset.alvo).getTime();   
  const doisDigitos = (n) => String(n).padStart(2, '0');

  function atualizar() {
    const falta = Math.max(0, alvo - Date.now());         
    document.getElementById('cd-d').textContent = doisDigitos(Math.floor(falta / 864e5));
    document.getElementById('cd-h').textContent = doisDigitos(Math.floor((falta % 864e5) / 36e5));
    document.getElementById('cd-m').textContent = doisDigitos(Math.floor((falta % 36e5) / 6e4));
    document.getElementById('cd-s').textContent = doisDigitos(Math.floor((falta % 6e4) / 1e3));
  }

  atualizar();
  setInterval(atualizar, 1000);                            
})();

(function () {
  const form = document.getElementById('form-inscricao');
  if (!form) return;

  const telefone = document.getElementById('telefone');
  const confirmacao = document.getElementById('confirmacao');
  const modalidade = document.getElementById('modalidade');

  const pre = new URLSearchParams(location.search).get('modalidade');
  if (pre === 'presencial' || pre === 'online') modalidade.value = pre;  

  function gerarCodigo() {
    const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const sorteio = crypto.getRandomValues(new Uint8Array(6));
    return 'SW26-' + Array.from(sorteio, (n) => letras[n % letras.length]).join('');
  }

  telefone.addEventListener('input', () => {
    let v = telefone.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = v.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d+)/, '($1) $2');
    telefone.value = v;
  });

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();                               

    if (!form.checkValidity()) {
      form.classList.add('was-validated');                 
      form.querySelector(':invalid').focus();              
      return;
    }

    const primeiroNome = document.getElementById('nome').value.trim().split(' ')[0];
    const email = document.getElementById('email').value.trim();

    const tipo = modalidade.options[modalidade.selectedIndex].text;

    const titulo = document.createElement('strong');
    titulo.textContent = 'Inscrição confirmada, ' + primeiroNome + '!';
    const detalhe = document.createElement('p');
    detalhe.className = 'my-2';
    detalhe.textContent = 'Modalidade: ' + tipo + '. Enviaremos os detalhes para ' + email + '.';
    const codigo = document.createElement('span');
    codigo.className = 'codigo-ingresso';
    codigo.textContent = gerarCodigo();
    confirmacao.replaceChildren(titulo, detalhe, document.createTextNode('Seu código de ingresso: '), codigo);
    confirmacao.classList.remove('d-none');
    confirmacao.focus();
    form.reset();
    form.classList.remove('was-validated');
  });
})();
