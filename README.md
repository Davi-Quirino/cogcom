# VITALIS — Conectando você à saúde

Landing page para clínica multidisciplinar com atendimento humanizado em psicologia, psiquiatria, neuropsicologia e nutrição.

## Estrutura do Projeto

```
white-medical/
├── index.html              # Página principal (landing page)
├── design-system.html      # Documentação do design system
├── css/
│   └── styles.css          # Estilos customizados (variáveis, animações, layout)
├── js/
│   ├── main.js             # Scripts da aplicação (menu, FAQ, scroll, video scrub)
│   └── vendor/
│       ├── tailwind.js     # Tailwind CSS (Play CDN runtime)
│       ├── iconify.js      # Iconify (carregamento de ícones)
│       └── lucide.js       # Lucide Icons
├── assets/
│   ├── fonts/              # Fontes locais (.woff2)
│   ├── images/             # Imagens locais (.jpg, .webp, .avif)
│   └── videos/             # Vídeos (hero scrub animation)
└── copy/                   # Copy decks em Markdown (referência de conteúdo)
```

## Stack

- **HTML5** semântico com Tailwind CSS (via CDN runtime)
- **Iconify** + **Lucide** para ícones
- **GSAP** + **ScrollTrigger** para animações scroll-driven
- **Google Fonts**: Playfair Display, Cormorant Garamond, Cormorant SC, Montserrat, Lora
- Imagens servidas via **Supabase Storage**

## Como Rodar Localmente

Qualquer servidor estático serve. Exemplos:

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .

# VS Code
# Use a extensão "Live Server"
```

Acesse `http://localhost:8000` no navegador.

## Deploy

O projeto é estático e pode ser implantado em qualquer serviço de hospedagem:

- **Vercel**: `vercel --prod`
- **Netlify**: arraste a pasta no dashboard
- **GitHub Pages**: habilite nas configurações do repositório
- **Cloudflare Pages**: conecte o repositório

## Configuração

Antes de colocar em produção, substitua os placeholders:

1. **WhatsApp**: procure por `5500000000000` e troque pelo número real
2. **Meta tags OG**: adicione `og:image` e `og:url` no `<head>` do `index.html`
3. **Analytics**: adicione Google Analytics ou similar antes do `</head>`
