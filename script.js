// Efeito de brasas subindo na tela
const emberContainer = document.getElementById('embers');
const N = 22;
for (let i = 0; i < N; i++) {
  const d = document.createElement('div');
  d.className = 'ember-particle';
  const left = Math.random() * 100;
  const size = 2 + Math.random() * 3;
  const duration = 6 + Math.random() * 7;
  const delay = Math.random() * 10;
  const drift = (Math.random() * 60 - 30) + 'px';
  d.style.left = left + 'vw';
  d.style.width = size + 'px';
  d.style.height = size + 'px';
  d.style.animationDuration = duration + 's';
  d.style.animationDelay = delay + 's';
  d.style.setProperty('--drift', drift);
  emberContainer.appendChild(d);
}

const form = document.getElementById('animeForm');
const formBanner = document.getElementById('formBanner');
const formBannerText = document.getElementById('formBannerText');
const successPanel = document.getElementById('successPanel');
const successSummary = document.getElementById('successSummary');
const successTitle = document.getElementById('successTitle');
const resetBtn = document.getElementById('resetBtn');

// Regras de validação de cada campo
const fields = {
  titulo: {
    el: document.getElementById('titulo'),
    validate: v => v.trim().length > 0
  },
  genero: {
    el: document.getElementById('genero'),
    validate: v => v.trim().length > 0
  },
  ano: {
    el: document.getElementById('ano'),
    validate: v => {
      const n = Number(v);
      return v.trim() !== '' && !isNaN(n) && n >= 1950 && n <= 2026;
    }
  },
  estudio: {
    el: document.getElementById('estudio'),
    validate: v => v.trim().length > 0
  },
  episodios: {
    el: document.getElementById('episodios'),
    validate: v => {
      const n = Number(v);
      return v.trim() !== '' && !isNaN(n) && n >= 1;
    }
  },
  sinopse: {
    el: document.getElementById('sinopse'),
    validate: v => v.trim().length >= 20
  }
};

// Mostra ou esconde o erro de um campo específico
function setFieldState(key, valid) {
  const wrapper = document.getElementById('field-' + key);
  const input = fields[key].el;
  if (valid) {
    wrapper.classList.remove('show-error');
    input.classList.remove('invalid');
  } else {
    wrapper.classList.add('show-error');
    input.classList.add('invalid');
  }
}

// Validação em tempo real, só depois que o campo foi tocado
Object.keys(fields).forEach(key => {
  const { el, validate } = fields[key];
  const evt = (el.tagName === 'SELECT') ? 'change' : 'input';
  el.addEventListener(evt, () => {
    if (el.dataset.touched === 'true') {
      setFieldState(key, validate(el.value));
    }
  });
  el.addEventListener('blur', () => {
    el.dataset.touched = 'true';
    setFieldState(key, validate(el.value));
  });
});

// Envio do formulário
form.addEventListener('submit', function (e) {
  e.preventDefault();

  let allValid = true;
  let firstInvalid = null;

  Object.keys(fields).forEach(key => {
    const { el, validate } = fields[key];
    el.dataset.touched = 'true';
    const ok = validate(el.value);
    setFieldState(key, ok);
    if (!ok) {
      allValid = false;
      if (!firstInvalid) firstInvalid = el;
    }
  });

  if (!allValid) {
    formBannerText.textContent = 'Falta preencher ou corrigir algum campo. Verifique os destaques em vermelho.';
    formBanner.classList.add('visible');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  formBanner.classList.remove('visible');

  const data = {
    titulo: fields.titulo.el.value.trim(),
    genero: fields.genero.el.value,
    ano: fields.ano.el.value,
    estudio: fields.estudio.el.value.trim(),
    episodios: fields.episodios.el.value,
    sinopse: fields.sinopse.el.value.trim()
  };

  successTitle.textContent = data.titulo;
  successSummary.innerHTML = `
    <dt>Gênero</dt><dd>${data.genero}</dd>
    <dt>Ano</dt><dd>${data.ano}</dd>
    <dt>Estúdio</dt><dd>${data.estudio}</dd>
    <dt>Episódios</dt><dd>${data.episodios}</dd>
    <dt>Sinopse</dt><dd>${data.sinopse}</dd>
  `;

  form.style.display = 'none';
  document.querySelector('.kicker').style.display = 'none';
  document.getElementById('formTitle').style.display = 'none';
  document.getElementById('formSub').style.display = 'none';
  successPanel.classList.add('visible');
});

// Botão de reiniciar o formulário
resetBtn.addEventListener('click', function () {
  form.reset();
  Object.keys(fields).forEach(key => {
    fields[key].el.dataset.touched = 'false';
    setFieldState(key, true);
  });
  formBanner.classList.remove('visible');
  successPanel.classList.remove('visible');
  form.style.display = 'flex';
  document.querySelector('.kicker').style.display = 'block';
  document.getElementById('formTitle').style.display = 'block';
  document.getElementById('formSub').style.display = 'block';
});