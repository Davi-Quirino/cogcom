# Especificação de implementação — Página `/pacientes` (Captura de pacientes · Psicologia)

> **Para a LLM implementadora:** este documento é a especificação completa para construir a página de captação de pacientes do **Instituto CogCom**, servida em `goccom.com.br/pacientes`. Implemente **um único arquivo `pacientes.html`** na raiz do projeto, reaproveitando ao máximo o que já existe no site (design system, fontes, CSS, JS). **Os textos (copy) são obrigatórios e devem ser reproduzidos VERBATIM** — não reescreva, não resuma, não "melhore". Apenas remova as anotações internas e preencha os placeholders sinalizados.

---

## Visão geral

- **Objetivo da página:** converter o visitante em uma de duas ações, sempre oferecidas **juntas** em cada ponto de CTA:
  1. **WhatsApp** (CTA primário, menor fricção) → `https://wa.me/5531996771867`
  2. **Formulário** (CTA secundário) → âncora `#formulario`, que ao enviar **monta uma mensagem de WhatsApp** (não há backend).
- **Fonte da copy:** [`copy/copy4.md`](copy/copy4.md) — versão "inspirada na estrutura BeHealth", orientada a condições + autoridade científica. Use os textos exatamente como estão lá.
- **Referência de estrutura/layout:** [https://behealth.com.br/psicologo](https://behealth.com.br/psicologo) — landing linear de conversão, CTAs repetidos, onboarding via WhatsApp. A `copy4` foi escrita espelhando essa estrutura.
- **Identidade visual:** [`design-system.html`](design-system.html) + [`css/styles.css`](css/styles.css) (tokens, tipografia, componentes). A página deve ser **visualmente coerente** com [`index.html`](index.html).

## Stack & reaproveitamento (não reinventar)

| Recurso | O que usar |
| --- | --- |
| CSS / tokens | `css/styles.css?v=3` (variáveis `:root`, classes utilitárias) |
| JS | `js/main.js?v=2` — já provê: menu mobile (`#open-menu`/`#close-menu`/`#mobile-menu`), `window.toggleFaq`, e o `IntersectionObserver` que ativa `.scroll-reveal` |
| Tailwind | `js/vendor/tailwind.js` |
| Ícones | Iconify **Solar** (`data-icon="solar:..."`), `js/vendor/iconify.js` |
| Fontes | Google Fonts — Playfair Display (títulos), Lora (corpo), Montserrat (`.font-label`), Cormorant |
| Animação | GSAP + ScrollTrigger (CDN, como no index) + `.scroll-reveal`/`.animate-reveal`/`.delay-*` |

## Regras globais (valem para a página inteira)

1. **Hierarquia de CTA:** em **todo** ponto de CTA aparecem **dois botões juntos** — Primário WhatsApp (preenchido dourado, `bg var(--gold)` / texto `var(--brown-900)`) + Secundário Formulário (contornado, `href="#formulario"`). **Nunca apenas um.**
2. **Tom de voz:** educativo, acolhedor, confiante; sério sem ser frio; empático sem ser dramático. Segunda pessoa ("você"). Respeita o Código de Ética do CFP — **sem diagnósticos em publicidade**, sem sensacionalismo, **zero promessas de cura** ou números fabricados.
3. **Linguagem de "sinais/situações", nunca "sintomas de [transtorno]".**
4. **Placeholders `[DADO REAL]`:** se não houver dado verídico, **remova o bloco inteiro** (contadores, diretores, podcasts) — nunca invente. Nada de `[DADO REAL]` visível em produção.
5. **Alternância de fundo** entre seções (claro creme ↔ escuro marrom) para ritmo visual.

## Ordem das seções (não alterar)

0. Fundação técnica (head, rota, nav, footer, WhatsApp flutuante)
1. **Hero** (`#hero`) — headline, subheadline, dual CTA, contadores de prova social
2. **Condições** (`#condicoes`) — 5 condições com "sinais" expansíveis
3. **Como funciona** (`#como-funciona`) — timeline de 4 passos
4. **Quem está por trás** (`#equipe`) — autoridade do time + podcasts (opcional)
5. **FAQ** (`#faq`) — 5 categorias, 15 perguntas
6. **CTA final + Formulário** (`#formulario`) — fechamento + formulário que monta WhatsApp

---

## 0. Fundação técnica

### 0.1 Arquivo e rota

- **Criar** o arquivo `pacientes.html` na **raiz** do projeto (mesmo nível de `index.html`).
- **Editar** `vercel.json` adicionando o rewrite desta página **sem remover** o rewrite existente do minicurso. Resultado final:

```json
{
  "rewrites": [
    { "source": "/minicurso-ansiedade", "destination": "/minicurso-ansiedade.html" },
    { "source": "/pacientes", "destination": "/pacientes.html" }
  ]
}
```

### 0.2 `<head>`

Copiar **exatamente** a estrutura do `<head>` de `index.html` (linhas ~3–38): mesmo `charset`, `viewport`, preconnect para `fonts.googleapis.com`/`fonts.gstatic.com`, o mesmo `<link>` das fontes Google (Playfair Display, Cormorant Garamond, Cormorant SC, Montserrat, Lora), `css/styles.css?v=3`, e os vendor scripts `js/vendor/tailwind.js`, `js/vendor/iconify.js`, `js/vendor/lucide.js`. Manter `<html class="scroll-smooth" lang="pt-BR">` e `<meta name="theme-color" content="#4a2518" />`.

Substituir apenas o `<title>`, a `<meta name="description">` e as tags Open Graph pelos valores do META CONTENT do copy4 (verbatim):

```html
<title>Psicologia Online Baseada em Evidência | Instituto CogCom</title>
<meta
  name="description"
  content="Psicólogos especializados em TCC, ACT e DBT. Atendimento 100% online para ansiedade, burnout, depressão e mais. Fale com a equipe CogCom — sem compromisso."
/>
<meta name="theme-color" content="#4a2518" />

<!-- Open Graph -->
<meta property="og:title" content="Psicologia Online Baseada em Evidência | Instituto CogCom" />
<meta property="og:description" content="Psicólogos especializados em TCC, ACT e DBT. Atendimento 100% online para ansiedade, burnout, depressão e mais. Fale com a equipe CogCom — sem compromisso." />
<meta property="og:type" content="website" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:url" content="https://institutocogcom.com.br/pacientes" />
```

> Não reaproveitar o `#initial-loader` do index (a página `/pacientes` é uma landing de captura — sem o loader/vídeo de abertura). Pode-se omitir todo o bloco de loader e seu `<style>`.

### 0.3 Navbar desktop + menu mobile

Reaproveitar **o mesmo markup** das duas estruturas do index.html, **mantendo as mesmas classes e os mesmos IDs** `#open-menu`, `#close-menu` e `#mobile-menu` (o `js/main.js` depende deles para abrir/fechar o overlay). Duas alterações obrigatórias:

1. **Logo / link de marca:** o `href="#hero-wrapper"` do index deve virar `href="/"` (ou `#hero`). Manter a `<img src="logo cogcom transp.png" ...>`.
2. **Links de navegação:** trocar os links do index (`#quem-somos`, `#para-voce`, `#jornada`, `#especialidades`) pelas âncoras desta página, na navbar desktop **e** no overlay mobile. Conjunto de links desta página:

| Texto do link | href |
| --- | --- |
| Início | `/` |
| Condições | `#condicoes` |
| Como funciona | `#como-funciona` |
| Equipe | `#equipe` |
| FAQ | `#faq` |
| Contato | `#formulario` |

O botão **"Agendar atendimento"** (presente na navbar desktop e no rodapé do overlay mobile) permanece como link de WhatsApp preenchido em dourado. Atualizar a mensagem para a desta página (URL-encoded):

```
https://wa.me/5531996771867?text=Ol%C3%A1%21%20Vim%20pela%20p%C3%A1gina%20de%20psicologia%20da%20CogCom%20e%20gostaria%20de%20saber%20mais.
```

(texto decodificado: `Olá! Vim pela página de psicologia da CogCom e gostaria de saber mais.`)

### 0.4 Botão flutuante de WhatsApp (fixo)

Adicionar logo após a `<nav>`, um link âncora fixo no canto inferior direito, sempre visível:

- `class="fixed bottom-6 right-6 z-[90] flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-transform hover:scale-105"`
- Fundo: **verde WhatsApp/sage** — usar `style="background-color: var(--sage-600)"` (`#446957`) com ícone em `var(--cream-25)`. (Alternativa de marca: `var(--gold)` com ícone `var(--brown-900)` — escolher sage para leitura imediata de "WhatsApp".)
- Ícone: `<span class="iconify w-7 h-7" data-icon="ri:whatsapp-fill"></span>` (fallback aceitável: `solar:chat-round-line-linear`).
- `href` = mesma URL de WhatsApp da seção 0.3, `target="_blank" rel="noopener noreferrer"`.
- `aria-label="Conversar pelo WhatsApp"`.

### 0.5 Footer

Reaproveitar **o footer inteiro** do index.html (linhas ~4002–4145), incluindo: bloco da marca, coluna "Institucional" com `lgpd.html` e `politica-privacidade.html`, link do Instagram `https://instagram.com/institutocogcom` (`@institutocogcom`) e a linha `© 2026 CogCom – Todos os Direitos Reservados.`. Na coluna "Especialidades", trocar os `href="#especialidades"` por `#condicoes` (âncora válida nesta página). O cartão "AGENDAR ATENDIMENTO / Fale conosco" pode receber um `href` de WhatsApp envolvendo-o, mas não é obrigatório.

### 0.6 Scripts no fim do body

Antes de `</body>`, reutilizar os mesmos scripts do index na ordem: GSAP + ScrollTrigger (os dois `<script>` de CDN) e, por fim, `<script src="js/main.js?v=2"></script>`. O `main.js` já provê: toggle do menu mobile (`#open-menu`/`#close-menu`/`#mobile-menu`), `window.toggleFaq` (para a Seção 5) e o `IntersectionObserver` que ativa elementos com a classe `.scroll-reveal`. **Não** reescrever nenhuma dessas funções. (O snippet do formulário, na Seção 6, pode ser adicionado aqui ou no fim de `main.js`.)

### 0.7 Tokens de design (resumo para a LLM)

| Token | Valor | Uso típico |
| --- | --- | --- |
| `--brown-950` | `#3a1a0e` | fundos escuros profundos |
| `--brown-900` | `#4a2518` | fundo escuro padrão, texto sobre dourado |
| `--brown-800` | `#5c3322` | cards sobre fundo escuro |
| `--brown-700` | `#6b3d2e` | fundo body padrão |
| `--brown-400` | `#a07a68` | texto secundário sobre escuro |
| `--brown-300` | `#c4a68e` | texto terciário / ícones discretos |
| `--cream-50` | `#f2e5d0` | fundo claro de seção / texto sobre escuro |
| `--cream-25` | `#f8f0e3` | fundo claro mais suave |
| `--gold` | `#c9a96e` | CTA primário, destaques, beams |
| `--gold-light` | `#d4bc8a` | hover de elementos dourados |
| `--gold-muted` | `#b89b6a` | borda do CTA secundário |
| `--sage-600` | `#446957` | botão flutuante WhatsApp, acentos |
| `--sage-100` | `#e1efe7` | fundos suaves / chips |

**Tipografia:** títulos (h1–h6) = **Playfair Display** (automático via CSS); corpo = **Lora** (automático no `body`); labels/uppercase = **Montserrat** via classe `.font-label`; itálico decorativo = `.font-decorative` (Playfair itálico). Não declarar `font-family` inline (exceto onde indicado para inputs/parágrafos).

### 0.8 Convenções de botão

Em **todo** ponto de CTA aparecem **dois botões juntos** (regra copy4 — nunca só um):

- **Primário (WhatsApp):** preenchido. `style="background-color: var(--gold); color: var(--brown-900)"`, `target="_blank" rel="noopener noreferrer"`, `href` = URL de WhatsApp.
- **Secundário (Formulário):** contornado/transparente. `style="border: 1px solid var(--gold-muted); background-color: transparent; color: var(--cream-50)"` (sobre fundo escuro) ou `color: var(--brown-900)` (sobre fundo claro); `href="#formulario"`.

Formato base dos dois (pill com seta), reaproveitando o padrão de botão do site:

```html
<a class="inline-flex items-center justify-center gap-2 text-sm font-label font-semibold uppercase tracking-wider py-4 px-8 rounded-full transition-all shadow-md hover:shadow-lg"
   style="background-color: var(--gold); color: var(--brown-900)" ...>
  Texto do botão
  <span class="iconify w-4 h-4" data-icon="solar:arrow-right-linear"></span>
</a>
```

O ícone de seta `solar:arrow-right-linear` acompanha o botão primário (e pode acompanhar o secundário). Agrupar os dois em `<div class="flex flex-col sm:flex-row gap-4">`.

### 0.9 Convenções de seção

- Wrapper padrão:

```html
<section id="..." class="relative py-24 lg:py-28" style="background-color: var(--cream-25)">
  <div class="max-w-[1600px] mx-auto px-6 lg:px-[6%]">
    …
  </div>
</section>
```

- **Padding vertical:** `py-24` (mobile) / `lg:py-28`.
- **Alternância de fundo:** intercalar seções claras (`var(--cream-25)` / `var(--cream-50)`, texto em `var(--brown-900)`) e escuras (`var(--brown-900)` / `var(--brown-950)`, texto em `var(--cream-50)`). O hero (Seção 1) é escuro.
- **Reveal:** adicionar `.scroll-reveal` (e, para escalonar, `.delay-100/200/300/500/700`) aos blocos que devem animar na entrada — o `IntersectionObserver` do `main.js` cuida do resto. Para o hero acima da dobra, preferir `.animate-reveal` (anima no load).
- **Labels de seção:** texto curto em Montserrat uppercase com tracking largo, em `var(--gold)` ou `var(--brown-400)`: `class="font-label text-xs font-semibold uppercase tracking-widest"`.
- Decoração opcional: `.grid-line-v` / `.grid-line-h` e `.beam-h` / `.beam-v` para linhas/feixes sutis, como no index.

---

## 1. Seção 1 — Hero

### Objetivo

Apresentar a proposta de valor da CogCom (psicologia online baseada em evidência, com matching) e converter imediatamente em **dois caminhos**: iniciar conversa no WhatsApp (primário) e preencher formulário (secundário). Plantar credibilidade logo de cara por meio de contadores numéricos de prova social — **somente se houver dados reais**. É a primeira dobra; deve carregar visível (sem depender de scroll).

### Layout (ref. BeHealth)

Reproduzir o hero de duas colunas do BeHealth (`behealth.com.br/psicologo`):

- **Coluna esquerda (≈55–60% da largura no desktop):** LABEL → H1 → SUBHEADLINE → grupo de dois CTAs → (opcional) texto de credencial.
- **Coluna direita (≈40–45%):** elemento **visual + contadores de prova social** empilhados verticalmente (os 3 números em destaque). Se não houver dados reais para os contadores, a coluna direita fica apenas com um elemento visual da identidade CogCom (imagem/ilustração ou cartão decorativo com `.beam-v`/`grid-line`).
- **Mobile:** as colunas **empilham** — texto primeiro, visual/contadores depois. Os CTAs ficam em coluna (`flex-col`) e largura total; viram linha (`sm:flex-row`) a partir de `sm`.
- Fundo **escuro** (identidade CogCom): `var(--brown-900)` com leve gradiente/aura dourada opcional. Texto em `var(--cream-50)`; destaques em `var(--gold)`.

### Estrutura HTML & responsividade

```html
<section id="hero" class="relative overflow-hidden pt-32 pb-24 lg:pt-36 lg:pb-28"
         style="background-color: var(--brown-900)">
  <!-- opcional: aura/gradiente dourado + grid-line-v decorativos, pointer-events-none, z-0 -->
  <div class="max-w-[1600px] mx-auto px-6 lg:px-[6%] relative z-10">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

      <!-- Coluna esquerda: conteúdo -->
      <div class="lg:col-span-7 animate-reveal">
        <span class="font-label text-xs font-semibold uppercase tracking-widest"
              style="color: var(--gold)">…LABEL…</span>
        <h1 class="mt-6 text-4xl md:text-5xl lg:text-6xl leading-tight"
            style="color: var(--cream-50)">…H1…</h1>
        <p class="mt-6 text-lg leading-relaxed max-w-xl"
           style="color: var(--brown-300)">…SUBHEADLINE…</p>
        <div class="mt-10 flex flex-col sm:flex-row gap-4">
          <!-- CTA primário + CTA secundário (ver 0.8) -->
        </div>
      </div>

      <!-- Coluna direita: contadores / visual -->
      <div class="lg:col-span-5 animate-reveal delay-300">
        <!-- 3 contadores OU visual (ver subseção Contadores) -->
      </div>

    </div>
  </div>
</section>
```

Responsividade: `grid-cols-1` no mobile → `lg:grid-cols-12` no desktop (7/5). H1 escala `text-4xl` → `lg:text-6xl`. Subheadline com `max-w-xl` para boa medida de leitura. Botões `w-full` no mobile dentro do `flex-col`.

### Componentes/classes do design system a reutilizar

- `.animate-reveal` no bloco esquerdo (carrega visível, anima no load); `.delay-300` na coluna direita para escalonar.
- `.font-label` no LABEL e nos textos dos botões; títulos herdam Playfair automaticamente.
- Botões: padrão da seção 0.8 (primário dourado / secundário contornado, pill, `solar:arrow-right-linear`).
- Decoração opcional: `.grid-line-v`, `.beam-v` (cor `--beam-color` = dourado) posicionados absolutos com `z-0` e `pointer-events-none`.
- Container e paddings conforme seção 0.9.

### Copy exata (verbatim — não alterar)

**LABEL** (acima do H1):

> `Instituto CogCom — Psicologia Online`

**H1 — Opção A (recomendada, usar esta):**

> **Conectando você ao cuidado certo para a sua saúde mental.**

**Alternativas para A/B test** (não renderizar simultaneamente — manter como comentário HTML para futuro teste):

> Opção B: **Psicologia online com método, escuta e ciência.**
> Opção C: **Saúde mental por quem leva a ciência a sério.**

**SUBHEADLINE:**

> O Instituto CogCom conecta você a psicólogos especializados em abordagens com comprovação científica. Atendimento 100% online, com profissionais selecionados para o seu caso — não aleatoriamente.

**Texto dos CTAs (verbatim):**

- Primário (WhatsApp): `Falar com a equipe pelo WhatsApp`
- Secundário (Formulário): `Preencher formulário de contato`

### CTAs

Dois botões juntos (regra obrigatória — nunca só um), conforme seção 0.8:

- **Primário:** texto `Falar com a equipe pelo WhatsApp`, preenchido dourado (`background-color: var(--gold); color: var(--brown-900)`), `href` = URL WhatsApp contextual da seção 0.3, `target="_blank" rel="noopener noreferrer"`, com `solar:arrow-right-linear`.
- **Secundário:** texto `Preencher formulário de contato`, contornado (`border: 1px solid var(--gold-muted); background: transparent; color: var(--cream-50)`), `href="#formulario"`.

### Contadores de prova social

Exibir na coluna direita **3 contadores** lado a lado / empilhados, cada um com número grande (Playfair) + rótulo (Montserrat). Todos os valores são placeholders **`[DADO REAL]`** — preencher antes de publicar com dados verídicos:

| Contador | Valor | Exemplo (não publicar como real) |
| --- | --- | --- |
| Profissionais na equipe | `[DADO REAL]` | "12 psicólogos especializados" |
| Pessoas atendidas | `[DADO REAL]` | "800+ pessoas atendidas" |
| Atendimentos realizados | `[DADO REAL]` | "4.000+ sessões realizadas" |

Texto opcional abaixo dos contadores (verbatim):

> Todos os profissionais com registro ativo no CRP e formação em abordagens baseadas em evidência.

**REGRA OBRIGATÓRIA:** os contadores **só podem usar dados reais**. **Se não houver dados reais disponíveis, REMOVER a seção inteira de contadores** — é melhor não ter números do que ter números inventados. Nesse caso, substituir a coluna direita por um elemento visual da identidade CogCom (imagem/ilustração ou cartão decorativo) e manter apenas o texto de credencial acima como linha de apoio sob os CTAs, se desejado. Não inventar valores; não deixar `[DADO REAL]` visível em produção.

Sugestão de animação count-up: se já houver GSAP carregado, pode-se animar a contagem; é **opcional** e não deve bloquear renderização. Os números devem permanecer legíveis mesmo sem JS.

### Acessibilidade & motion

- H1 único na página (`<h1>`); LABEL é `<span>`/`<p>`, não heading.
- Botões/links com texto descritivo; o botão flutuante e ícones decorativos com `aria-label` ou `aria-hidden="true"` conforme o caso (ícones puramente decorativos = `aria-hidden`).
- Contraste: `var(--cream-50)` sobre `var(--brown-900)` e `var(--brown-900)` sobre `var(--gold)` atendem AA — manter esses pares.
- Foco visível nos CTAs (não remover outline; pode-se reforçar com `focus-visible:ring`).
- Respeitar `prefers-reduced-motion`: as animações de entrada usam `.animate-reveal`/`.scroll-reveal`; garantir que o conteúdo seja legível mesmo se a animação não rodar (estado final = totalmente visível). O count-up dos contadores deve ser desabilitado (mostrar valor final estático) quando `prefers-reduced-motion: reduce`.

---

## 2. Seção 2 — Por que as pessoas buscam a CogCom (condições)

> O container raiz da seção DEVE ter `id="condicoes"` (`<section id="condicoes">`) para ancoragem e navegação interna.

### Objetivo

Apresentar 5 condições/situações concretas em que a CogCom ajuda, cada uma com headline, descrição curta e uma lista de "sinais comuns" expansível, para que o visitante se reconheça em uma situação específica e seja conduzido aos dois CTAs (WhatsApp primário, Formulário secundário).

REGRA ÉTICA OBRIGATÓRIA (vinda da copy4): usar sempre linguagem de "sinais" e "situações" — nunca "sintomas de [transtorno]". Não diagnosticar. Não alterar nenhuma palavra da copy abaixo.

### Layout (ref. BeHealth)

Inspirado em `https://behealth.com.br/psicologo`, onde os motivos/condições aparecem como blocos/cards. Aqui:

- Bloco de cabeçalho da seção no topo: um `label` (font-label, uppercase, tracking largo, cor `var(--gold-muted)` ou `var(--sage-600)`) seguido do H2 introdutório.
- Abaixo, um grid de 5 cards de condição.
- Cada card: ícone temático Solar no topo + headline (H3) + descrição (2-3 frases) + um acordeão "sinais comuns" (fechado por padrão).
- Ao final da seção, um bloco de transição centralizado com texto + os dois botões (dual CTA) lado a lado.
- Fundo da seção: usar tom claro de identidade (`var(--cream-50)` ou `var(--cream-100)`); cards em `var(--cream-25)`/branco com borda sutil `var(--cream-200)`. Como o hero é escuro, esta seção clara contrasta bem.

### Estrutura HTML & responsividade

- `<section id="condicoes" class="...">` envolvendo cabeçalho + grid + bloco de CTA.
- Cabeçalho: `<p class="font-label ...">` (label) e `<h2 ...>` (headline da seção). Aplicar `.scroll-reveal` no cabeçalho.
- Grid de cards responsivo: `class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"` (1 col mobile / 2 col tablet / 3 col desktop). Alternativa simétrica: `lg:grid-cols-2`.
- Cada card é um `<article class="... scroll-reveal">` com, em ordem vertical: (1) wrapper do ícone, (2) `<h3>` headline (Playfair, `var(--brown-800)`), (3) `<p>` descrição (Lora/`font-light`, `var(--brown-600)`/`var(--brown-700)`), (4) acordeão de sinais.
- Stagger: aplicar `.delay-100/200/300/400` nos cards 2 a 5 (card 1 sem delay), como na FAQ do index.
- O acordeão de sinais segue o mesmo padrão `height: 0 → scrollHeight` do FAQ. A lista de sinais é um `<ul>` dentro do `.faq-body`.

**ATENÇÃO ao reaproveitar `window.toggleFaq`:** a função em `js/main.js` é **single-open global** — fecha TODOS os `.faq-item.is-open` do documento ao abrir um novo, e recolore forçando `var(--gold)`/`var(--brown-400)`/`var(--cream-50)`. Duas opções:

- **Opção A (recomendada — coerência com o site):** reutilizar as classes `.faq-item/.faq-header/.faq-body/.faq-icon/.faq-icon-bar-v` e `onclick="toggleFaq(this)"`. Aceitar o comportamento single-open. **O gatilho dos sinais NÃO deve ser `<h3>`** (a função recolore `.faq-header h3` para `var(--cream-50)`, ilegível sobre creme) — use `<span>`/`<button>`. Defina os estados-base do ícone em `var(--brown-700)` (a função sobrescreve para `var(--gold)` ao abrir, o que funciona bem sobre creme).
- **Opção B (alternativa):** `<details>/<summary>` nativo estilizado — `aria-expanded` automático e múltiplos abertos sem JS, porém menos coerente com o padrão atual. **Recomenda-se a Opção A.**

Markup do acordeão por card (espelhar o do `index.html` ~L2193, adaptado para "sinais" e fundo claro): `<div class="faq-item">` → `.faq-header` clicável com texto do gatilho ("Sinais comuns" / "Sinais de que pode ser o momento") + `.faq-icon` (traço horizontal + `.faq-icon-bar-v` vertical que rotaciona 90°) → `.faq-body` (`height:0;overflow:hidden;transition:height .5s cubic-bezier(.16,1,.3,1)`) com `<ul>` de `<li>`.

### Componentes/classes do design system a reutilizar

- Acordeão FAQ: `.faq-item`, `.faq-header`, `.faq-body`, `.faq-icon`, `.faq-icon-bar-v` + `window.toggleFaq(this)`.
- Cards: padrão do `design-system.html` (cantos arredondados, borda sutil, sombra leve). Fundo `var(--cream-25)`/branco, borda `var(--cream-200)`.
- Ícones Solar (via `data-icon`), dentro de chip/círculo com fundo `var(--sage-100)`, cor `var(--sage-600)`/`var(--gold)`:
  - Condição 1 — Ansiedade: `solar:wind-linear`
  - Condição 2 — Burnout: `solar:battery-low-linear`
  - Condição 3 — Tristeza/depressão: `solar:cloud-linear`
  - Condição 4 — Sono: `solar:moon-linear`
  - Condição 5 — Desenvolvimento/alta performance: `solar:graph-up-linear`
- Tipografia: headlines Playfair; corpo Lora; labels `.font-label`.
- Animação: `.scroll-reveal` + `.delay-100/200/300/400`.

### Copy exata (verbatim — não alterar)

**LABEL da seção:**

> `Principais razões que levam pessoas à psicoterapia`

**HEADLINE da seção (H2):**

> **Os profissionais do Instituto CogCom utilizam métodos baseados em ciência para ajudar você a lidar com desafios reais. Veja se você se reconhece em alguma dessas situações.**

---

**CONDIÇÃO 1 — Ansiedade** · ícone `solar:wind-linear`

Headline do card (H3):

> **Ansiedade**

Descrição:

> A preocupação constante com o que pode acontecer — ou não acontecer — afeta mais do que o humor. Interfere no sono, na concentração, nos relacionamentos e na capacidade de estar presente. Com abordagens como TCC e ACT, é possível desenvolver estratégias concretas para lidar com a ansiedade no dia a dia.

Gatilho do acordeão: `Sinais comuns`

Lista de sinais (itens exatos):

- Inquietação, medo ou preocupação frequentes, sem motivo aparente
- Cansaço sem esforço físico e dificuldade de concentração
- Dificuldade para dormir ou despertar várias vezes durante a noite
- Coração acelerado, falta de ar ou sensação de aperto no peito
- Tensão muscular persistente sem causa identificada

---

**CONDIÇÃO 2 — Burnout (esgotamento)** · ícone `solar:battery-low-linear`

Headline do card (H3):

> **Burnout (esgotamento)**

Descrição:

> O ritmo de trabalho pode levar o corpo e a mente a um ponto de exaustão que não melhora com descanso. Burnout não é "frescura" — é uma condição reconhecida pela OMS. A psicoterapia ajuda a reconstruir limites, recuperar energia e reencontrar sentido na rotina.

Gatilho do acordeão: `Sinais comuns`

Lista de sinais (itens exatos):

- Cansaço extremo, físico e mental, que não passa com descanso
- Dificuldade de se motivar para tarefas que antes eram normais
- Sentimentos de fracasso, incompetência ou desconexão do trabalho
- Irritabilidade frequente, dores de cabeça, alterações no apetite
- Sensação de estar "no automático" — funcionando, mas não vivendo

---

**CONDIÇÃO 3 — Tristeza prolongada e depressão** · ícone `solar:cloud-linear`

Headline do card (H3):

> **Tristeza prolongada e depressão**

Descrição:

> Quando a tristeza dura semanas, tira o prazer das coisas que antes importavam e afeta a rotina, pode ser mais do que uma fase. A psicoterapia baseada em evidência trabalha com estratégias estruturadas para ajudar a retomar o engajamento com a vida — passo a passo, sem pressa.

Gatilho do acordeão: `Sinais comuns`

Lista de sinais (itens exatos):

- Sentir-se triste, vazio ou sem esperança na maior parte do tempo
- Perda de interesse em atividades que antes davam prazer
- Alterações no sono — dormir demais ou ter insônia
- Fadiga ou falta de energia, mesmo após descanso
- Dificuldade para se concentrar, tomar decisões ou se lembrar de coisas
- Isolamento social — evitar pessoas e situações

---

**CONDIÇÃO 4 — Problemas de sono** · ícone `solar:moon-linear`

Headline do card (H3):

> **Problemas de sono**

Descrição:

> O sono é uma das primeiras coisas afetadas quando algo não vai bem emocionalmente. E a privação de sono, por sua vez, agrava tudo o resto — humor, concentração, imunidade, relacionamentos. Trabalhar o sono na psicoterapia é tratar a causa, não apenas o sintoma.

Gatilho do acordeão: `Sinais comuns`

Lista de sinais (itens exatos):

- Dificuldade para pegar no sono ou insônia recorrente
- Acordar várias vezes durante a noite
- Sonolência intensa durante o dia, mesmo dormindo horas suficientes
- Irritabilidade, falta de disposição e dificuldade de concentração durante o dia
- Uso recorrente de medicação para dormir sem acompanhamento adequado

---

**CONDIÇÃO 5 — Desenvolvimento pessoal e alta performance** · ícone `solar:graph-up-linear`

Headline do card (H3):

> **Desenvolvimento pessoal e alta performance**

Descrição:

> Psicoterapia não é só para quem está em crise. Muitas pessoas buscam acompanhamento psicológico para se conhecerem melhor, desenvolverem habilidades emocionais e tomarem decisões mais alinhadas com seus valores. Abordagens como ACT são particularmente eficazes para esse tipo de trabalho.

Gatilho do acordeão (DIFERENTE das demais — usar exatamente): `Sinais de que pode ser o momento`

Lista de sinais (itens exatos):

- Sensação de estar "estagnado" mesmo sem um problema específico
- Dificuldade para definir prioridades ou tomar decisões importantes
- Desejo de construir relacionamentos mais saudáveis
- Querer entender padrões de comportamento que se repetem
- Busca por mais clareza, propósito ou equilíbrio na vida

---

**Texto de transição (após os 5 cards, antes dos botões):**

> Reconheceu alguma dessas situações? O primeiro passo é uma conversa — sem compromisso.

**Texto do botão primário (WhatsApp):** `Falar pelo WhatsApp`
**Texto do botão secundário (Formulário):** `Preencher o formulário`

### CTAs

Dois botões juntos (lado a lado em `sm:`+, empilhados no mobile), centralizados sob o texto de transição, com `.scroll-reveal`.

- PRIMÁRIO (WhatsApp): preenchido, `background: var(--gold)`, texto `var(--brown-900)`. Link sugerido (URL-encoded): `https://wa.me/5531996771867?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20CogCom%20e%20gostaria%20de%20conversar%20sobre%20atendimento%20psicol%C3%B3gico.` (`target="_blank" rel="noopener"`).
- SECUNDÁRIO (Formulário): contornado (sobre fundo claro: borda `var(--gold-muted)`/`var(--brown-700)`, texto `var(--brown-800)`), `href="#formulario"`.

### Acessibilidade & motion

- `aria-expanded` em cada gatilho de acordeão (idealmente um `<button>`), alternando `false`/`true`; `aria-controls` apontando para o `id` do `.faq-body` (`role="region"` + `aria-labelledby`).
- Teclado: se usar `<div onclick>`, adicionar `tabindex="0"`, `role="button"` e handler Enter/Espaço. Preferível `<button>` nativo.
- Foco visível (`:focus-visible`) nos gatilhos e CTAs.
- `prefers-reduced-motion`: neutralizar transições de `height` do `.faq-body`, rotação do `.faq-icon-bar-v` e entrada `.scroll-reveal`.
- Ícones decorativos: `aria-hidden="true"`.

---

## 3. Seção 3 — Como funciona

Seção com `id="como-funciona"`. Processo do Instituto CogCom em quatro etapas, em formato timeline inspirado no bloco "Como funciona" da BeHealth.

### Objetivo

Reduzir a fricção percebida mostrando, de forma visual e sequencial, o caminho do primeiro contato até o início do atendimento. Cada passo transmite simplicidade ("sem burocracia", "sem compromisso") e reforça o diferencial de *matching*. Termina com dual CTA.

### Layout (ref. BeHealth)

- **Mobile (`< lg`):** timeline **vertical**. 4 passos empilhados. À esquerda, coluna estreita com número grande + ícone e uma **linha conectora vertical** (1px, `--gold` baixa opacidade ou `--brown-300`) ligando os marcadores. À direita, título + corpo. O último passo não tem linha abaixo.
- **Desktop (`lg+`):** timeline **horizontal de 4 colunas** (`grid grid-cols-4`). Número grande no topo, ícone, título, corpo. **Linha conectora horizontal** (1px) atravessa o topo, passando *atrás* dos marcadores.
- Número grande decorativo reaproveitando `.step-number` / `.step-number-wrapper` (Playfair, `clamp(8rem,14vw,14rem)`, `opacity: 0.2`, cor `--brown-200`), incluindo o ajuste óptico do glifo "4" em `.steps-grid > article:nth-child(4)`.
- Ícone do passo em **caixa de ícone** (quadrado arredondado), em destaque (`--gold` ou `--sage`).
- Fundo: claro/neutro (`--cream-100` ou `--cream-200`) com texto `--brown-800`.

### Estrutura HTML & responsividade

```html
<section id="como-funciona" class="relative z-10 py-24 lg:py-28"
         style="background-color: var(--cream-100); color: var(--brown-800)">
  <div class="max-w-[1600px] mx-auto px-6 lg:px-[6%]">

    <div class="text-center max-w-3xl mx-auto mb-16 lg:mb-20 scroll-reveal">
      <span class="font-label text-[11px] font-semibold tracking-[0.2em] uppercase"
            style="color: var(--brown-500)">[LABEL]</span>
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1] mt-4"
          style="color: var(--brown-900)">[HEADLINE H2]</h2>
    </div>

    <ol class="steps-grid relative">  <!-- reusar .steps-grid (4 cols desktop) -->
      <li class="relative flex flex-col items-center text-center scroll-reveal delay-100">
        <div class="step-number-wrapper">
          <span class="step-number" aria-hidden="true">1</span>
          <div class="absolute ..."> <!-- ícone Solar do passo --> </div>
        </div>
        <h3 class="text-xl lg:text-2xl font-semibold tracking-tight mt-4"
            style="color: var(--brown-900)">[TÍTULO PASSO]</h3>
        <p class="text-base leading-relaxed mt-3 max-w-xs"
           style="color: var(--brown-600); font-family: 'Lora', serif">[CORPO PASSO]</p>
      </li>
      <!-- ... 4 passos ... -->
    </ol>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16 lg:mt-20 scroll-reveal">
      <!-- botão primário WhatsApp + botão secundário Formulário -->
    </div>
  </div>
</section>
```

Responsividade (herdar breakpoints de `.steps-grid` no `styles.css`): `≥1024px` 4 colunas + linha horizontal; `≤768px` 2 colunas (linha decorativa/oculta); `≤480px` 1 coluna vertical com linha à esquerda. Timeline semântica como `<ol>`/`<li>`.

### Componentes/classes do design system a reutilizar

- Número grande: `.step-number` + `.step-number-wrapper` (com ajuste do "4"). Grade: `.steps-grid`.
- Caixa de ícone: padrão do design-system (`w-12 h-12 rounded-lg`, `background-color: rgba(201,169,110,0.15)` com `color: var(--gold)`, ou variante sage). Ícones Solar via `data-icon`.
- Linha conectora: estética de `.grid-line-h`/`.grid-line-v` (cor `--brown-300`/`--gold` opacidade ~0.3).
- Reveal: `.scroll-reveal` + `.delay-100/200/300`.
- **Ícones Solar por passo:** Passo 1 `solar:chat-round-line-linear`; Passo 2 `solar:users-group-rounded-linear`; Passo 3 `solar:link-round-linear`; Passo 4 `solar:videocamera-record-linear`.

### Copy exata (verbatim — não alterar)

**LABEL:** `Como funciona o trabalho do Instituto CogCom`

**HEADLINE (H2):**

> **Do primeiro contato ao início do seu processo — em quatro etapas.**

**PASSO 1 — título:** **Você entra em contato**
**PASSO 1 — corpo:**

> Pelo WhatsApp ou pelo formulário — como preferir. Sem roteiro pronto, sem burocracia. Basta dizer que quer conversar sobre atendimento psicológico.

**PASSO 2 — título:** **A equipe analisa sua demanda**
**PASSO 2 — corpo:**

> Nossa equipe entra em contato para entender o que você está buscando. Essa conversa é sem custo e sem compromisso. O objetivo é conhecer seu contexto e identificar o profissional mais adequado.

**PASSO 3 — título:** **Você é conectado ao profissional certo**
**PASSO 3 — corpo:**

> Com base na análise, indicamos o psicólogo mais adequado à sua demanda, considerando abordagem, especialidade e perfil. É um processo de matching — não uma designação aleatória.

**PASSO 4 — título:** **Seu atendimento começa**
**PASSO 4 — corpo:**

> As sessões são 100% online, por videochamada segura. Desde o primeiro encontro, você e seu psicólogo definem objetivos e estrutura do processo. Tudo com transparência e acompanhamento contínuo.

### CTAs

Dual CTA centralizado após os 4 passos. **Não alterar os textos.**

- Botão PRIMÁRIO (WhatsApp): preenchido dourado, pill com `solar:arrow-right-linear`, `target="_blank"`. Texto verbatim: `Quero iniciar pelo WhatsApp`. Mensagem sugerida (URL-encoded) para `?text=`: `Ol%C3%A1!%20Quero%20iniciar%20meu%20atendimento%20com%20o%20Instituto%20CogCom.`
- Botão SECUNDÁRIO (Formulário): contornado, `href="#formulario"`. Texto verbatim: `Preencher o formulário`.

### Acessibilidade & motion

- Timeline como `<ol>`/`<li>`. Número grande decorativo `aria-hidden="true"` (o título `<h3>` carrega o significado). Ícones e linha conectora `aria-hidden="true"` / `pointer-events:none`.
- Botão WhatsApp com `aria-label` descritivo + `rel="noopener noreferrer"`.
- Contraste `--brown-600`/`--brown-800` sobre `--cream-100` atende AA. Respeitar `prefers-reduced-motion`.

---

## 4. Seção 4 — Quem está por trás da CogCom

Seção com `id="equipe"`. Bloco de autoridade: headline + parágrafo institucional, cards dos diretores/fundadores e, opcionalmente, bloco de mídia/podcasts.

### Objetivo

Construir confiança mostrando rigor acadêmico e supervisão clínica por trás da plataforma. Diferenciar a CogCom de "plataformas genéricas de agendamento" via credenciais reais (formação, CRP, supervisão). O bloco de podcasts, quando houver dados reais, reforça autoridade.

### Layout (ref. BeHealth)

- **Bloco 1 — Autoridade:** LABEL + H2 (Playfair) + 2 parágrafos de contexto (Lora), `max-w-3xl`.
- **Bloco 2 — Cards de diretores:** grid com **foto** (retrato vertical ou círculo) + **nome** + **título acadêmico**. Desktop `grid-cols-3` (ou `4` se houver 4); tablet `grid-cols-2`; mobile coluna única ou carrossel (apenas se > 4). Foto no padrão do hero do design-system: `overflow-hidden`, `object-cover`, `border: 2px solid var(--gold-muted)` (retrato `rounded-xl` ~280×360, ou circular `rounded-full`).
- **Bloco 3 — Mídia/Podcasts (OPCIONAL):** headline + intro + cards (thumbnail + tema + participante + link), `grid-cols-3` desktop / 1 col mobile.
- **Fundo escuro** (`--brown-800`/`--brown-900`), texto creme/dourado — destaca os cards e contrasta com a seção "Como funciona" (clara).

### Estrutura HTML & responsividade

```html
<section id="equipe" class="relative z-10 py-24 lg:py-28"
         style="background-color: var(--brown-900)">
  <div class="max-w-[1600px] mx-auto px-6 lg:px-[6%]">

    <!-- BLOCO 1: Autoridade -->
    <div class="max-w-3xl mb-16 lg:mb-20 scroll-reveal">
      <span class="font-label text-[11px] font-semibold tracking-[0.2em] uppercase"
            style="color: var(--gold-muted)">[LABEL]</span>
      <h2 class="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1] mt-4"
          style="color: var(--cream-50)">[HEADLINE H2]</h2>
      <div class="space-y-5 mt-6">
        <p class="text-base lg:text-lg leading-relaxed" style="color: var(--cream-300); font-family: 'Lora', serif">[PARÁGRAFO 1]</p>
        <p class="text-base lg:text-lg leading-relaxed" style="color: var(--cream-300); font-family: 'Lora', serif">[PARÁGRAFO 2]</p>
      </div>
    </div>

    <!-- BLOCO 2: Cards de diretores -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      <article class="flex flex-col items-center text-center scroll-reveal delay-100">
        <div class="relative overflow-hidden"
             style="width: min(280px,100%); aspect-ratio: 3/4; border-radius: 1rem; border: 2px solid var(--gold-muted)">
          <img src="[FOTO]" alt="[Nome completo] — [Título]"
               style="width:100%;height:100%;object-fit:cover;object-position:top" />
        </div>
        <h3 class="font-decorative text-xl mt-5" style="color: var(--gold-light)">[Nome completo]</h3>
        <p class="font-label text-xs mt-1 tracking-wide" style="color: var(--cream-300)">[Título acadêmico]</p>
      </article>
    </div>

    <!-- BLOCO 3 (OPCIONAL): Mídia / Podcasts — renderizar SOMENTE se houver [DADO REAL]; senão remover -->
  </div>
</section>
```

Responsividade: diretores 1→2→3 col (ou 4); >4 diretores vira carrossel `overflow-x-auto` + `scroll-snap-type: x mandatory` com `.mask-linear-fade`. Podcasts 3 col (`md+`) → 1 col.

### Componentes/classes do design system a reutilizar

- Foto/retrato do hero (borda `--gold-muted`, `object-cover`); nome `.font-decorative` `--gold-light`; credencial `.font-label` `--cream-300`.
- "Content Card (Dark)" para cards de podcast; "Caixa de Ícone" com `solar:microphone-linear`/`solar:play-circle-linear` para thumbnails sem imagem.
- "Link de Texto" (`solar:arrow-right-linear`) para o link de cada episódio.
- `.scroll-reveal` + delays; `.mask-linear-fade` para carrossel.

### Copy exata (verbatim — não alterar)

**LABEL:** `Quem cuida do cuidado`

**HEADLINE (H2):**

> **Saúde mental por quem leva a ciência a sério.**

**PARÁGRAFO DE CONTEXTO (2 parágrafos):**

> O Instituto CogCom foi fundado por profissionais com formação em neurociências, psicobiologia e psicologia clínica. Não somos uma plataforma genérica de agendamento — somos uma equipe que seleciona, supervisiona e acompanha cada profissional que faz parte da rede.

> Todos os psicólogos da CogCom possuem registro ativo no CRP, formação em instituições reconhecidas pelo MEC e treinamento contínuo nas abordagens que aplicam.

**CARDS DOS DIRETORES/FUNDADORES** — 3 a 4 diretores, cada um com:
- Nome: `[DADO REAL — Nome completo]`
- Título acadêmico: `[DADO REAL — ex.: "Doutor em Neurociências"]`
- Foto: `[DADO REAL — URL da foto profissional]`

**BLOCO DE MÍDIA / PODCASTS (opcional)** — headline e texto verbatim; episódios com placeholders:

Headline do bloco:

> **Compartilhamos conhecimento. Sem custo.**

Texto introdutório:

> Os profissionais do Instituto CogCom participam ativamente de podcasts e iniciativas de divulgação científica. Confira alguns episódios:

Cada episódio (3): Tema `[DADO REAL]` · Participante `[DADO REAL]` · Link `[DADO REAL]`.

### Regras de placeholder

- **Diretores:** renderizar apenas cards **reais, confirmados e autorizados**. NUNCA inventar nomes, títulos ou fotos. Sem nenhum dado real → **remover o Bloco 2**, mantendo apenas o Bloco 1 (institucional). Não usar fotos de stock representando diretores.
- **Podcasts/Mídia:** Bloco 3 **inteiramente opcional**. Sem episódios reais (tema + participante + URL verificáveis) → **remover o bloco inteiro**.
- Ajustar o grid ao número real de diretores. Na dúvida, **omitir o bloco** é preferível a exibir dado fabricado.

### Acessibilidade & motion

- Cada card é `<article>`; nome em `<h3>`; `<img>` com `alt` = nome + título. Cards de podcast como links acessíveis (`aria-label` com tema), externos `target="_blank" rel="noopener noreferrer"`.
- Ícones decorativos `aria-hidden="true"`.
- Contraste: `--cream-50`/`--cream-300` sobre `--brown-900` (AA). Verificar `--gold-light` (#d4bc8a) sobre `--brown-900`; se abaixo de AA, usar `--cream-50` ou aumentar peso/tamanho.
- Carrossel (se usado): navegação por teclado preservada. Respeitar `prefers-reduced-motion`.

---

## 5. Seção 5 — FAQ

### Objetivo

Dissolver objeções finais antes da conversão, organizando 15 perguntas em 5 categorias temáticas (instituto, profissionais, atendimento online, valores, privacidade). É a última camada de confiança antes do formulário.

### Layout (ref. BeHealth)

- Seção `id="faq"`, fundo ESCURO: `background-color: var(--brown-900)`. Texto em cream/dourado — igual à FAQ do `index.html`. Container padrão, `py-24 lg:py-28`.
- Cabeçalho: LABEL (`.font-label`, uppercase, `tracking-[0.2em]`, `var(--brown-400)`) acima de HEADLINE H2 (Playfair, `var(--cream-50)`).
- Acordeão **agrupado em 5 categorias**, cada uma com sub-header + 3 itens. Numere **continuamente de 01. a 15.** (não reinicie por categoria).
- Bloco do acordeão em `max-w-4xl` centralizado.

### Estrutura HTML & responsividade

**Reutilize o markup EXATO de um item de FAQ** do `index.html` (fundo escuro), repetido 15 vezes — troque apenas o número (`01.`…`15.`), o `<h3>` (pergunta) e o `.faq-body > div` (resposta). NÃO altere classes, estilos inline ou a estrutura do ícone:

```html
<div class="faq-item scroll-reveal" style="border-bottom: 1px solid rgba(242, 229, 208, 0.1)">
  <div class="faq-header flex items-center gap-6 py-6 cursor-pointer select-none" onclick="toggleFaq(this)">
    <span class="text-sm font-label flex-shrink-0 transition-colors duration-300" style="color: var(--brown-400); min-width: 2.5rem">01.</span>
    <div class="flex-1 flex items-center justify-between gap-6">
      <h3 class="text-base md:text-lg font-medium transition-colors duration-300" style="color: var(--cream-50)">PERGUNTA AQUI</h3>
      <div class="faq-icon flex-shrink-0" style="width:18px;height:18px;position:relative">
        <div style="position:absolute;top:50%;left:0;right:0;height:1.5px;background-color:var(--brown-400);transform:translateY(-50%);transition:background-color .3s"></div>
        <div class="faq-icon-bar-v" style="position:absolute;left:50%;top:0;bottom:0;width:1.5px;background-color:var(--brown-400);transform:translateX(-50%) rotate(0deg);transition:transform .4s cubic-bezier(.16,1,.3,1),background-color .3s"></div>
      </div>
    </div>
  </div>
  <div class="faq-body" style="height:0;overflow:hidden;transition:height .5s cubic-bezier(.16,1,.3,1)">
    <div class="pb-8 pl-[4rem] pr-4 font-light leading-relaxed text-sm md:text-base" style="color: var(--brown-300)">RESPOSTA AQUI</div>
  </div>
</div>
```

**Sub-header de categoria** (antes de cada grupo de 3 itens), fora dos `.faq-item`, com destaque dourado:

```html
<h3 class="font-label text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mt-12 mb-2 first:mt-0" style="color: var(--gold)">Sobre o Instituto CogCom</h3>
```

Não usar `<h2>` no sub-header (o H2 é a headline da seção). O markup já é fluido; sub-headers reduzem para `text-xs` no mobile.

### Componentes/classes a reutilizar

- Acordeão (NÃO reescrever): `.faq-item`, `.faq-header`, `.faq-body`, `.faq-icon`, `.faq-icon-bar-v` + `window.toggleFaq(this)` (já em `js/main.js`: single-open, anima `height`, rotaciona a barra vertical, recolore para `var(--gold)` ao abrir).
- `.scroll-reveal` em cada item; opcionalmente `.delay-100/200/300` em cascata por grupo.

### Copy exata (verbatim — não alterar)

**LABEL:** `Perguntas frequentes`

**HEADLINE (H2):**

> **Tudo o que você precisa saber antes de dar o primeiro passo.**

---

**CATEGORIA 1 — `Sobre o Instituto CogCom`** (itens 01–03)

**01. O que é o Instituto CogCom?**
> O Instituto CogCom é uma clínica de psicologia online especializada em psicoterapia baseada em evidência científica. Conectamos pessoas a psicólogos treinados em abordagens como TCC, ACT e DBT, com um processo de matching que considera a demanda, o perfil e a especialidade de cada profissional.

**02. A CogCom é uma plataforma de agendamento?**
> Não. Somos uma clínica com equipe própria de psicólogos, coordenação clínica e supervisão contínua. A diferença é que cada profissional da CogCom é selecionado, acompanhado e treinado — não é apenas alguém que se cadastrou em uma plataforma.

**03. Por que "baseada em evidência"?**
> Porque trabalhamos exclusivamente com abordagens psicológicas que foram testadas em estudos clínicos controlados e mostraram eficácia documentada. Isso não significa que outras abordagens não funcionem — significa que as que utilizamos têm o maior volume de respaldo científico disponível.

---

**CATEGORIA 2 — `Sobre os profissionais`** (itens 04–06)

**04. Quem são os psicólogos do Instituto CogCom?**
> Psicólogos com registro ativo no CRP, formação em instituições reconhecidas pelo MEC e especialização clínica em abordagens baseadas em evidência. Todos passam por processo seletivo e participam de supervisão clínica contínua.

**05. Como os profissionais são selecionados?**
> O processo considera formação acadêmica, experiência clínica, alinhamento com a prática baseada em evidência e valores éticos. Não abrimos vagas indiscriminadamente — cada profissional é avaliado antes de atender pela CogCom.

**06. Posso escolher meu psicólogo?**
> Nosso processo é baseado em matching: indicamos o profissional mais adequado à sua demanda. Sempre que possível, consideramos suas preferências. Se após as primeiras sessões você sentir que não houve conexão, fazemos uma nova indicação sem custo adicional.

---

**CATEGORIA 3 — `Sobre o atendimento online`** (itens 07–09)

**07. Os atendimentos são todos online?**
> Sim. Todas as sessões acontecem por videochamada segura, com a mesma qualidade, ética e sigilo do atendimento presencial. Estudos publicados em periódicos como <em>The Lancet Psychiatry</em> demonstram eficácia comparável entre os dois formatos.

> **Nota de implementação:** preserve o itálico em `<em>The Lancet Psychiatry</em>`.

**08. Preciso de algum equipamento especial?**
> Não. Basta um dispositivo com câmera e microfone (celular, tablet ou computador), em um local com privacidade e conexão estável de internet. Você receberá orientações sobre a plataforma antes da primeira sessão.

**09. E se minha internet cair durante a sessão?**
> Imprevistos acontecem. Se houver queda de conexão, o psicólogo aguarda o retorno e, se necessário, o tempo é compensado. A prioridade é que sua sessão seja completa.

---

**CATEGORIA 4 — `Sobre valores e agendamento`** (itens 10–12)

**10. Quanto custa uma sessão?**
> Os valores variam conforme o profissional e a especialidade. Ao entrar em contato pela primeira vez, nossa equipe informa os valores com transparência total — antes de qualquer compromisso da sua parte.

**11. Como agendo meu atendimento?**
> Pelo WhatsApp ou pelo formulário. Nossa equipe faz o primeiro contato, entende sua demanda, informa valores e horários disponíveis, e agenda a primeira sessão com o profissional indicado.

**12. Preciso de encaminhamento médico para começar?**
> Não. Você pode procurar psicoterapia por iniciativa própria, sem encaminhamento. Se futuramente for necessária uma avaliação complementar (psiquiátrica, neuropsicológica etc.), o próprio processo terapêutico pode indicar isso.

---

**CATEGORIA 5 — `Privacidade e segurança`** (itens 13–15)

**13. Meus dados estão seguros?**
> Seguimos rigorosamente a Lei Geral de Proteção de Dados (LGPD). Seus dados pessoais são usados exclusivamente para viabilizar o atendimento e nunca são compartilhados com terceiros para fins comerciais.

**14. O conteúdo das sessões é confidencial?**
> Totalmente. Todos os profissionais seguem o Código de Ética do Psicólogo (CFP), que garante sigilo profissional absoluto. O que é dito na sessão permanece entre você e seu psicólogo.

**15. Posso trocar de profissional se não me adaptar?**
> Sim, sem constrangimento e sem custo adicional de remanejamento. A relação terapêutica é um dos fatores mais importantes para o resultado. Se não houver conexão, faremos uma nova indicação.

### Acessibilidade & motion

- Teclado/ARIA: o `.faq-header` deve ser operável por teclado. Como usa `onclick` num `<div>`, adicionar `role="button"`, `tabindex="0"`, `aria-expanded="false"` (alternar para `true` ao abrir) e disparar `toggleFaq(this)` no `keydown` Enter/Espaço; associar `aria-controls` ao `id` do `.faq-body`.
- **ALERTA — `toggleFaq` é single-open GLOBAL:** fecha todos os outros `.faq-item` da página ao abrir um. A Seção 2 também usa `.faq-item`; abrir um sinal lá fecha uma pergunta aberta aqui e vice-versa. **Recomendação: manter o reaproveitamento** (comportamento aceitável). Se um dia for indesejável, escopar o single-open por contêiner dentro de `js/main.js` — não criar uma segunda função.
- `prefers-reduced-motion`: sob a media query, zerar/encurtar transições de `.faq-body` e `.faq-icon-bar-v`.

---

## 6. Seção 6 — CTA final + Formulário

### Objetivo

Converter quem leu a página inteira. Combina fechamento emocional curto (headline + micro-copy), dual CTA e o formulário inline. **Sem backend:** ao enviar, o formulário monta uma mensagem de WhatsApp com os campos preenchidos e abre `https://wa.me/5531996771867?text=…`. Encerra com rodapé institucional (CFP/LGPD + copyright).

### Layout

- Seção `id="formulario"`, fundo ESCURO: `background-color: var(--brown-950)` (#3a1a0e). Texto cream (`var(--cream-50)`), acentos dourados. Container padrão, `py-24 lg:py-28`.
- Estrutura recomendada: **bloco de fechamento centralizado no topo**, **formulário abaixo em card centralizado** (`max-w-xl`), espelhando a simplicidade do BeHealth.
  1. **Fechamento:** HEADLINE H2 (Playfair, cream) → MICRO-COPY (Lora, `var(--cream-300)`) → dual CTA. Secundário aponta ao próprio card (`href="#formulario"`).
  2. **Card do formulário:** fundo claro (`var(--cream-100)`) sobre o fundo escuro, para legibilidade dos inputs. Headline do formulário no topo, campos empilhados, botão de envio full-width, micro-copy de sigilo abaixo.
- **Rodapé institucional** discreto abaixo do card, centralizado (`var(--brown-400)`/`var(--brown-300)`), copyright por último.
- **Dual CTA:** Primário WhatsApp preenchido dourado → `https://wa.me/5531996771867` (link direto). Secundário contornado (`border: 1px solid var(--gold-muted)`, texto `var(--cream-50)`/`var(--gold)`) → `href="#formulario"`.

### Estrutura HTML & responsividade

- Fechamento centralizado (`text-center max-w-3xl mx-auto`). H2 `text-4xl md:text-5xl`; micro-copy `text-base md:text-lg max-w-2xl mx-auto`.
- Dual CTA: `flex flex-col sm:flex-row gap-4 justify-center mt-8`; botões `py-4 px-8 rounded .font-label uppercase tracking-wider`.
- Card: `max-w-xl mx-auto mt-16 rounded p-8 md:p-10`, `background-color: var(--cream-100)`, `border: 1px solid var(--cream-300)`. Headline em `var(--brown-900)`. Campos `space-y-6`; "O que te trouxe aqui?" é `<textarea rows="3">`.
- Botão de envio full-width dourado. Micro-copy abaixo: `text-xs italic var(--brown-500) mt-4 text-center`.
- Rodapé: `max-w-3xl mx-auto mt-16 text-center`, parágrafo `text-xs md:text-sm var(--brown-300)`, copyright `var(--brown-400) mt-4 .font-label`.
- `.scroll-reveal` nos blocos (cabeçalho, card, rodapé).

### Copy exata (verbatim — não alterar)

**HEADLINE (H2):**

> **O cuidado certo começa com uma conversa.**

**MICRO-COPY:**

> Fale com a equipe do Instituto CogCom. Sem compromisso, sem custo inicial, sem burocracia. Entenda como funciona, tire suas dúvidas e veja se faz sentido para você.

**CTA Primário (WhatsApp):** `Falar pelo WhatsApp agora`
**CTA Secundário (Formulário):** `Preencher o formulário abaixo`

**HEADLINE do formulário:**

> **Deixe seu contato. A gente cuida do próximo passo.**

**Campos (exato):**

| Campo | Label (verbatim) | Placeholder (verbatim) | Obrigatório |
| --- | --- | --- | --- |
| Nome | `Seu nome` | `Como podemos te chamar?` | **Sim** |
| WhatsApp | `Seu WhatsApp` | `(00) 00000-0000` | **Sim** |
| E-mail | `Seu e-mail` | `Opcional — para contato alternativo` | Não |
| O que está buscando | `O que te trouxe aqui?` | `Pode ser breve — só para termos contexto` | Não |

**BOTÃO DE ENVIO:** `Quero dar o primeiro passo`

**MICRO-COPY abaixo do botão:**

> _Suas informações são protegidas por sigilo profissional e pela LGPD. Sem spam._

**RODAPÉ INSTITUCIONAL:**

> O Instituto CogCom segue o Código de Ética do Psicólogo (CFP) e a Lei Geral de Proteção de Dados (LGPD). Todas as informações compartilhadas são tratadas com sigilo profissional.

**COPYRIGHT:** `© 2026 Instituto CogCom — Todos os Direitos Reservados`

### Componentes de formulário

- **Label:** `.font-label text-xs font-semibold uppercase tracking-wide`, `var(--brown-700)`, `mb-2`, associada via `for`/`id`.
- **Input/textarea base:** `w-full rounded px-4 py-3`, `font-family: "Lora", serif`, `background-color: var(--cream-50)`, `border: 1px solid var(--cream-300)`, texto `var(--brown-800)`, placeholder `var(--brown-400)`.
- **Foco dourado:**

```css
#lead-form input:focus,
#lead-form textarea:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.25);
}
```

- **Obrigatórios:** apenas Nome e WhatsApp (`required`). Tipos: Nome `text`; WhatsApp `tel`+`inputmode="tel"`; E-mail `email`+`inputmode="email"`; mensagem `<textarea>`.
- Máscara `(00) 00000-0000` no WhatsApp via JS no `input` é **opcional** (só formatação; não bloquear envio).

### Comportamento do formulário (SEM backend)

O formulário **não faz POST**. Ao enviar: previne o submit padrão, valida Nome e WhatsApp, monta mensagem multi-linha, faz `encodeURIComponent` e abre `https://wa.me/5531996771867?text=…` em nova aba.

**HTML do formulário** (manter `id`/`name` exatos para casar com o JS):

```html
<form id="lead-form" novalidate>
  <div class="space-y-6">
    <div>
      <label for="lead-nome" class="font-label text-xs font-semibold uppercase tracking-wide block mb-2" style="color: var(--brown-700)">Seu nome</label>
      <input id="lead-nome" name="nome" type="text" required aria-required="true"
             placeholder="Como podemos te chamar?"
             class="w-full rounded px-4 py-3"
             style="background-color: var(--cream-50); border: 1px solid var(--cream-300); color: var(--brown-800); font-family: 'Lora', serif" />
    </div>

    <div>
      <label for="lead-whatsapp" class="font-label text-xs font-semibold uppercase tracking-wide block mb-2" style="color: var(--brown-700)">Seu WhatsApp</label>
      <input id="lead-whatsapp" name="whatsapp" type="tel" inputmode="tel" required aria-required="true"
             placeholder="(00) 00000-0000"
             class="w-full rounded px-4 py-3"
             style="background-color: var(--cream-50); border: 1px solid var(--cream-300); color: var(--brown-800); font-family: 'Lora', serif" />
    </div>

    <div>
      <label for="lead-email" class="font-label text-xs font-semibold uppercase tracking-wide block mb-2" style="color: var(--brown-700)">Seu e-mail</label>
      <input id="lead-email" name="email" type="email" inputmode="email"
             placeholder="Opcional — para contato alternativo"
             class="w-full rounded px-4 py-3"
             style="background-color: var(--cream-50); border: 1px solid var(--cream-300); color: var(--brown-800); font-family: 'Lora', serif" />
    </div>

    <div>
      <label for="lead-mensagem" class="font-label text-xs font-semibold uppercase tracking-wide block mb-2" style="color: var(--brown-700)">O que te trouxe aqui?</label>
      <textarea id="lead-mensagem" name="mensagem" rows="3"
                placeholder="Pode ser breve — só para termos contexto"
                class="w-full rounded px-4 py-3"
                style="background-color: var(--cream-50); border: 1px solid var(--cream-300); color: var(--brown-800); font-family: 'Lora', serif"></textarea>
    </div>

    <button type="submit"
            class="w-full font-label font-semibold uppercase tracking-wider py-4 rounded transition-all shadow-md hover:shadow-lg"
            style="background-color: var(--gold); color: var(--brown-900)">
      Quero dar o primeiro passo
    </button>

    <p class="text-xs italic text-center mt-4" style="color: var(--brown-500)">
      Suas informações são protegidas por sigilo profissional e pela LGPD. Sem spam.
    </p>
  </div>
</form>
```

**Snippet JS (pronto — em `js/main.js` ou `<script>` no fim da página):**

```js
(function () {
  var form = document.getElementById("lead-form");
  if (!form) return;

  var WHATSAPP_NUMBER = "5531996771867";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nome = form.elements["nome"].value.trim();
    var whatsapp = form.elements["whatsapp"].value.trim();
    var email = form.elements["email"].value.trim();
    var mensagem = form.elements["mensagem"].value.trim();

    // Validação: Nome e WhatsApp são obrigatórios
    var nomeEl = form.elements["nome"];
    var whatsEl = form.elements["whatsapp"];
    var valido = true;

    if (!nome) { nomeEl.setAttribute("aria-invalid", "true"); valido = false; }
    else { nomeEl.removeAttribute("aria-invalid"); }

    if (!whatsapp) { whatsEl.setAttribute("aria-invalid", "true"); valido = false; }
    else { whatsEl.removeAttribute("aria-invalid"); }

    if (!valido) { (!nome ? nomeEl : whatsEl).focus(); return; }

    // Monta a mensagem multi-linha
    var linhas = [
      "Olá! Vim pela página de psicologia da CogCom.",
      "Nome: " + nome,
      "WhatsApp: " + whatsapp,
    ];
    if (email) linhas.push("E-mail: " + email);
    if (mensagem) linhas.push("O que me trouxe: " + mensagem);

    var texto = encodeURIComponent(linhas.join("\n"));
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + texto;

    window.open(url, "_blank", "noopener");
  });
})();
```

> Os atributos `name` (`nome`, `whatsapp`, `email`, `mensagem`) são obrigatórios — o JS depende deles. Os CTAs duais do topo da seção são independentes do formulário: primário = link `href="https://wa.me/5531996771867"`; secundário = `href="#formulario"`.

### Acessibilidade

- Labels associadas via `for`/`id` (já no HTML). Nome e WhatsApp com `required` + `aria-required="true"`; o JS marca `aria-invalid="true"` no campo vazio e move o foco para o primeiro inválido.
- `inputmode` adequado; foco visível dourado (anel `box-shadow`) substitui o outline removido.
- `novalidate` no `<form>` para a validação custom conduzir a experiência (o JS funciona como reforço). Respeitar `prefers-reduced-motion`.

---

## Checklist de aceitação (antes de considerar pronto)

- [ ] `pacientes.html` criado na raiz; abre em `/pacientes` (rewrite no `vercel.json` adicionado sem remover o do minicurso).
- [ ] `<head>` com `<title>`/`<meta description>`/OG do copy4; fontes, `css/styles.css?v=3`, vendor scripts e `js/main.js?v=2` carregando.
- [ ] Navbar desktop + menu mobile funcionando (`#open-menu`/`#close-menu`/`#mobile-menu`), com links âncora desta página.
- [ ] Botão flutuante de WhatsApp visível e clicável.
- [ ] As 6 seções na ordem correta, com os `id` corretos (`#hero`, `#condicoes`, `#como-funciona`, `#equipe`, `#faq`, `#formulario`).
- [ ] **Toda a copy verbatim** conforme `copy4.md` (sem anotações `[NOTA:]`, sem reescrita).
- [ ] **Dual CTA (WhatsApp + Formulário) em todos os pontos de CTA** — nunca só um.
- [ ] Acordeões de "sinais" (Seção 2) e FAQ (Seção 5) abrindo/fechando via `toggleFaq`; teclado e `aria-expanded` ok.
- [ ] Formulário (Seção 6) valida Nome+WhatsApp e abre o WhatsApp com a mensagem montada.
- [ ] Responsivo (mobile/tablet/desktop); contraste AA; `prefers-reduced-motion` respeitado.
- [ ] **Placeholders resolvidos** (ver abaixo) — nada de `[DADO REAL]` visível.

## Placeholders a preencher (ou remover) antes de publicar

| Local | Placeholder | Ação |
| --- | --- | --- |
| Seção 1 — contadores | `[DADO REAL]` × 3 | Preencher com dados verídicos **ou remover a seção de contadores inteira** |
| Seção 4 — diretores | `[DADO REAL]` × 3–4 (nome, título, foto) | Preencher com dados reais e autorizados **ou remover o bloco de cards** |
| Seção 4 — podcasts | `[DADO REAL]` × 3 (tema, participante, link) | Preencher **ou remover o bloco de podcasts** |

> **Regra de ouro:** na ausência de dado verídico, **remover o bloco** — nunca inventar números, nomes, credenciais, depoimentos ou episódios. Coerente com o tom honesto da página e com o Código de Ética do CFP.
