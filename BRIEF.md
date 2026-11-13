# Brief: landing page do Bootlift

> Coloque este arquivo na raiz do projeto `bootlift-site` e, no Claude Code, peça:
> **"Leia o BRIEF.md e siga as fases dele. Comece pela Fase 0 e pare no fim de
> cada fase para eu revisar."**

---

## 1. Contexto

O **Bootlift** é uma GitHub Action open-source (MIT), publicada no GitHub
Marketplace, que mede o quanto um projeto Java/Spring está pronto para o
**Spring Boot 4** e age direto no pull request.

- Repositório: https://github.com/GabrielRossi01/bootlift
- Demo real: https://github.com/GabrielRossi01/bootlift-demo/pulls?q=is%3Apr
- Autor: Gabriel Oliveira Rossi, Fullstack Developer
  - Portfólio: https://rossidev.vercel.app
  - LinkedIn: https://www.linkedin.com/in/gabriel-oliveira-rossi/
- Uso: `uses: GabrielRossi01/bootlift@v1`
- Versão atual: v1.0.1

Esta landing page é a **página de produto** do Bootlift. Ela precisa:

1. fazer quem chega entender em 5 segundos o que é e por que importa;
2. levar a pessoa a instalar a action (CTA principal) ou testar no playground;
3. mostrar o projeto como open-source e convidar a contribuir;
4. servir de peça de portfólio do autor, com acabamento de nível Awwwards.

### Fatos do produto (use exatamente estes, não invente números)

| Fato | Valor |
| --- | --- |
| Regras | 12 (`BOOT_VERSION`, `JAVA_BASELINE`, `GRADLE_VERSION`, `JAKARTA_NAMESPACE`, `JACKSON3_NAMESPACE`, `MOCKBEAN_REMOVED`, `UNDERTOW_REMOVED`, `SPOCK_REMOVED`, `SESSION_REMOVED`, `STARTER_RENAMED`, `LAUNCH_SCRIPT`, `PROPERTY_RENAMED`) |
| Propriedades renomeadas detectadas | 96 (vindas da receita do OpenRewrite) |
| O que lê | `pom.xml`, Gradle (Groovy e Kotlin DSL), version catalog, `gradle-wrapper.properties`, `application.*` (YAML e .properties), código Java/Kotlin |
| Precisa de JDK ou compilar? | Não. Análise estática, roda em segundos |
| Score | 0 a 100. Cada regra encontrada tira uma vez o peso da severidade (error 15, warning 5, info 1), +1 por ocorrência extra, até +10 por regra |
| Guardrail | Em PRs, só as linhas **adicionadas** podem reprovar o job. O legado conta no score, mas não trava ninguém |
| Sugestões de 1 clique | Correções determinísticas viram _suggestions_ na linha do PR ("Commit suggestion") |
| Relatórios | Comentário único no PR (atualizado a cada push), job summary e anotações nas linhas |
| Inputs | `path`, `mode` (guardrail/full), `fail-on` (none/warning/error), `comment-on-pr`, `suggestions`, `github-token` |
| Outputs | `score`, `blocking`, `errors` |
| Permissões | `contents: read` e `pull-requests: write` |
| Preço | Grátis, open-source, licença MIT |
| História da demo | `main` com score 94 → PR com código antigo cai para 60 e é reprovado com 6 sugestões → aplicar as sugestões → volta a 94 e fica verde |

### Workflow de exemplo (mostrar na página com botão de copiar)

```yaml
name: Spring Boot 4 readiness
on: [pull_request]

permissions:
  contents: read
  pull-requests: write

jobs:
  bootlift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: GabrielRossi01/bootlift@v1
        with:
          fail-on: error
```

---

## 2. Stack e decisões técnicas

- **Next.js** (versão estável mais recente, App Router) + **TypeScript** estrito.
- **Tailwind CSS** (v4, configuração via CSS com `@theme`).
- **i18n:** `next-intl`, rotas `/en` (padrão) e `/pt`, seletor de idioma na nav,
  `hreflang` nas metadata, textos em `messages/en.json` e `messages/pt.json`.
  Nenhum texto fixo nos componentes.
- **Animação:** Motion (`motion/react`) para entradas e microinterações. Nada de
  bibliotecas pesadas de 3D/WebGL sem necessidade real.
- **Código com destaque de sintaxe:** Shiki, renderizado no servidor (sem JS
  no cliente para isso).
- **Deploy:** Vercel. Site estático sempre que possível (SSG por idioma).
- **Qualidade:** ESLint + Prettier, `npm run build` sem warnings.

### Motor do playground (o mesmo da action)

O motor de regras do Bootlift é TypeScript puro, sem dependências de Node, e
roda no navegador. **Não reescreva as regras.** Crie
`scripts/sync-engine.mjs`, que:

1. clona `https://github.com/GabrielRossi01/bootlift` na tag `v1.0.1`
   (`git clone --depth 1 --branch v1.0.1`) numa pasta temporária;
2. copia para `src/lib/engine/` os arquivos `src/analyze.ts`, `src/project.ts`,
   `src/types.ts` e `src/rules/*.ts` (**não** copie `scanner.ts`, `main.ts`,
   `config.ts` nem `report/`, que dependem de Node ou do GitHub);
3. remove a extensão `.js` dos imports relativos (`from './project.js'` →
   `from './project'`);
4. adiciona no topo de cada arquivo:
   `// Gerado por scripts/sync-engine.mjs a partir de bootlift@v1.0.1. Não edite.`

Rode o script uma vez e **commite** a pasta gerada (o build da Vercel não deve
depender de clonar o repositório). Exponha `npm run sync-engine` no
`package.json`.

A entrada do motor é `analyze(files: SourceFile[])`, onde
`SourceFile = { scope: 'java' | 'build' | 'config'; path: string; content: string }`.
Crie em `src/lib/classify.ts` uma função que decide o `scope` pelo nome do
arquivo, com a mesma lógica do `classify` do `scanner.ts` original:

- `build`: `pom.xml`, `build.gradle`, `build.gradle.kts`, `gradle.properties`,
  `gradle-wrapper.properties` e arquivos `*.versions.toml`;
- `config`: `application` ou `bootstrap`, com perfil opcional, em
  `.properties`, `.yml` ou `.yaml`;
- `java`: `*.java` e `*.kt`.

As mensagens do motor estão em português. Na versão em inglês, mostre o texto a
partir de um dicionário `ruleId → { message, fix }` em `messages/en.json`. Para
`PROPERTY_RENAMED`, monte a frase com a chave antiga e a nova, que vêm do
próprio achado.

---

## 3. Direção de design

**Use a skill Impeccable em todas as fases.** Siga as regras anti "AI slop"
dela. Antes de entregar cada fase, rode a auditoria/crítica da skill e corrija
o que ela apontar.

### Personalidade

Técnico, confiante e preciso, como uma ferramenta de engenharia premium, com
uma pitada de leveza no nome ("lift", subir de versão). Referências de clima:
sites de produto de ferramentas dev de alto nível (Linear, Vercel, Raycast,
Warp), **sem copiar nenhum deles**.

### Tema: escuro, com o verde do logo

- Fundo quase preto com profundidade (gradientes sutis, ruído/grain leve), sem
  "preto chapado" e sem gradiente roxo genérico.
- **Cor de marca:** extraia o verde exato dos SVGs do logo (`public/brand/`) e
  monte a escala de cores a partir dele. O verde é acento: brilhos, foco,
  estados de sucesso e o score subindo. Não pinte tudo de verde.
- Cores semânticas das severidades, consistentes no site todo:
  `error` vermelho, `warning` âmbar, `info` azul (iguais às bolinhas
  🔴🟡🔵 do relatório).
- Tipografia: um par distinto e intencional (display + texto + mono para
  código), escolhido com a Impeccable. **Proibido** usar Inter, Roboto ou
  system-ui como fonte de display. Use `next/font`.

### Liquid glass (o efeito-assinatura)

Aplique em componentes que flutuam sobre o fundo, nunca em blocos de texto
longo:

- nav em pílula flutuante;
- card principal do hero;
- chips/badges, seletor de idioma e botões secundários;
- moldura do demo e painel do playground.

Implementação:

- camadas: `backdrop-filter: blur() saturate()`, borda interna com highlight
  (gradiente de 1px no topo), sombra externa suave e um brilho especular que
  acompanha o ponteiro (só desktop);
- refração: filtro SVG (`feTurbulence` + `feDisplacementMap`) **só** nos
  elementos do hero, com fallback para blur simples onde o navegador não
  suportar;
- respeite `prefers-reduced-transparency` (vidro vira superfície opaca) e
  `prefers-reduced-motion` (sem brilho que segue o ponteiro e sem parallax);
- contraste do texto sobre o vidro: no mínimo WCAG AA, testado de verdade;
- performance: no máximo 3 a 4 superfícies de vidro visíveis ao mesmo tempo e
  nunca `backdrop-filter` em áreas grandes que rolam.

### Hero section (a peça principal)

- Headline curta e forte sobre o benefício. Direções para testar, nos dois
  idiomas:
  - EN: "Upgrade to Spring Boot 4 without the migration debt."
  - PT: "Migre para o Spring Boot 4 sem dívida de migração."
- Subtítulo em uma frase: guardrail no PR + correções em 1 clique, em segundos
  e sem compilar.
- CTAs: **"Add to your workflow"** (rola até o quickstart) e **"Try the
  playground"**. Um chip de vidro com `uses: GabrielRossi01/bootlift@v1` e botão
  de copiar.
- **Visual:** um card de PR em liquid glass que conta a história da demo em
  loop. Primeiro o score cai de 94 para 60 (barra ▰▱ e número animados) e o
  status fica vermelho. Depois aparecem as linhas
  `import javax.servlet...` → `import jakarta.servlet...` como sugestão. Por
  fim, "Commit suggestion" é clicado e o score volta a 94, verde.
  O card é feito em HTML/CSS (não use o GIF aqui), leve e acessível, com
  `aria-live` desligado para não narrar o loop.
- Fundo do hero: luz verde volumétrica sutil atrás do card, que reage
  levemente ao scroll. Nada de partículas genéricas.
- O hero precisa ficar bonito em 375 px (mobile) também, não só no desktop.

### Seções (nesta ordem)

1. **Nav:** logo, links (How it works, Playground, Rules, Docs, Contribute),
   seletor EN/PT, botão GitHub com número de estrelas (buscado na API do GitHub
   no build, com `revalidate` de 1 h) e CTA "Marketplace".
2. **Hero.**
3. **Por que agora:** o Boot 4 traz Jakarta EE 11, Jackson 3, remoção do
   `@MockBean` e 96 propriedades renomeadas. Faixa de números: 12 regras · 96
   propriedades · 0 configuração · segundos por análise.
4. **Como funciona:** passo a passo em 3 etapas (Scan → Score → Guardrail e
   sugestões), cada uma com um trecho de código ou um mini-visual. Mostre a
   diferença entre código legado (só score) e código novo (bloqueia + sugere).
5. **Demo real:** o vídeo da demo numa moldura de navegador em vidro, com link
   para os PRs do `bootlift-demo`. Use `<video autoplay muted loop playsinline>`
   com WebM/MP4 (veja Assets). O GIF fica só como fallback.
6. **Playground:** área para colar um arquivo (ou escolher um exemplo pronto:
   `pom.xml` Boot 3.3, `build.gradle.kts`, `application.yml`, um teste com
   `@MockBean`). Mostra em tempo real: score animado, versões detectadas,
   lista de achados com severidade, linha, mensagem, correção e, quando
   existir, o "antes → depois" da sugestão. Tudo no cliente, com debounce, sem
   backend. Aviso discreto: "Seu código não sai do navegador."
7. **Regras:** grade das 12 regras com severidade, descrição curta e exemplo
   antes/depois. Filtro por severidade.
8. **Quickstart:** o workflow com botão de copiar, tabela de inputs e outputs,
   permissões e a diferença entre `@v1` e `@v1.0.1`.
9. **Score explicado:** visual simples da fórmula (pesos 15/5/1, +1 por
   ocorrência extra, teto de +10).
10. **Open source / Contribua:** convite claro com 4 caminhos (relatar falso
    positivo, sugerir regra, melhorar docs, mandar código), cada um com link
    para o formulário de issue certo:
    - `https://github.com/GabrielRossi01/bootlift/issues/new?template=1-falso-positivo.yml`
    - `https://github.com/GabrielRossi01/bootlift/issues/new?template=2-regra-nova.yml`
    - `https://github.com/GabrielRossi01/bootlift/blob/main/CONTRIBUTING.md`
    - `https://github.com/GabrielRossi01/bootlift/labels/good%20first%20issue`

    Mostre o passo a passo de contribuição em 4 etapas (fork → `npm ci` e
    `npm test` → regra + teste → `npm run bundle` e PR).
11. **FAQ** (acordeão acessível): funciona em PR de fork? (relatório sim,
    sugestões não); monorepo? (uma execução por serviço, com matrix); achou falso
    positivo? (formulário); precisa de JDK? (não); quanto custa? (grátis, MIT).
12. **CTA final** e **footer**: Marketplace, GitHub, licença MIT, "Feito por
    Gabriel Oliveira Rossi" com links para o portfólio e o LinkedIn.

---

## 4. Requisitos de qualidade (critérios de aceite)

- Lighthouse (mobile) ≥ 95 em Performance, Acessibilidade, Boas práticas e SEO.
- LCP < 2,5 s, CLS < 0,05. Nenhuma imagem sem `width`/`height`.
- Acessibilidade WCAG 2.2 AA: navegação por teclado completa, foco visível
  (no verde da marca), `prefers-reduced-motion` e
  `prefers-reduced-transparency` respeitados, contraste real sobre o vidro.
- Responsivo de 360 px a 1920 px, revisado em 375, 768, 1280 e 1536.
- SEO: metadata por idioma, Open Graph gerado com `next/og` (logo + headline +
  fundo da marca), `sitemap.xml`, `robots.txt`, favicon a partir do logo.
- Testes: o playground com os exemplos prontos deve dar o mesmo resultado da
  action (o `pom.xml` Boot 3.3 de exemplo precisa gerar achados de
  `BOOT_VERSION`, `STARTER_RENAMED` etc.). Crie ao menos testes unitários do
  `classify` e um teste que roda `analyze` nos exemplos.
- Sem texto de preenchimento ("Lorem ipsum") e sem números inventados.

---

## 5. Fases de trabalho (pare no fim de cada uma)

0. **Plano:** leia este brief, veja os assets em `public/`, rode
   `/impeccable init` se ainda não rodou, e me mostre o plano de design
   (paleta extraída do logo, par tipográfico, linguagem do liquid glass e
   estrutura de pastas). **Não escreva código ainda.**
1. **Fundação:** tokens de design no Tailwind, fontes, i18n (`/en` e `/pt`),
   layout, nav e footer, e o componente base `GlassSurface`.
2. **Hero:** o card de PR animado, o fundo e os CTAs. Rode a crítica da
   Impeccable e refine até ficar de nível Awwwards.
3. **Seções de conteúdo:** "Por que agora", "Como funciona", Demo, Regras,
   Quickstart, Score, Contribua, FAQ e CTA final.
4. **Playground:** `sync-engine`, `classify`, exemplos, UI e testes.
5. **Polimento:** animações de entrada, microinterações, auditoria completa
   da Impeccable, acessibilidade, Lighthouse, OG image e SEO.
6. **Entrega:** `npm run build` limpo, README do site (como rodar,
   `sync-engine`, deploy) e checklist dos critérios de aceite marcado.

Em cada fase, liste o que mudou, os comandos que rodou e o que ficou pendente.
