# EduConnect - Plataforma de Mentores

EduConnect é uma plataforma web que conecta mentores e estudantes, inspirada no Superprof. Desenvolvida com HTML, CSS e JavaScript puro, sem frameworks.

## 🎯 Objetivo

Missão 1 – HTML/CSS/JS: Criar uma plataforma funcional e responsiva para conectar mentores especialistas com estudantes que buscam aprender e desenvolver novas habilidades.

## ✨ Funcionalidades

### 🔍 Busca e Filtros
- Campo de busca por nome, área ou especialidade
- Filtros por área de conhecimento
- Filtros por faixa de preço (mínimo e máximo)
- Filtro por tipo de atendimento (online, presencial, híbrido)
- Ordenação por avaliação, preço ou nome
- Resultados em tempo real sem recarregamento

### 👨‍🏫 Lista de Mentores
- Cards responsivos com informações dos mentores
- Fotos, nomes, áreas de especialização
- Preço por hora e avaliações com estrelas
- Tags de especialidades
- Sistema de favoritos com persistência local
- Modal detalhado com biografia e disponibilidade

### 📅 Sistema de Agendamento
- Formulário completo de agendamento
- Seleção de mentor (populada dinamicamente)
- Seleção de data e hora
- Campo para mensagens adicionais
- Validação de campos obrigatórios
- Persistência em localStorage

### 👥 Grupos de Estudo
- Lista de grupos por área de conhecimento
- Materiais de estudo com links externos
- Sistema de tags para filtragem
- Busca por nome ou descrição

### ❤️ Sistema de Favoritos
- Adicionar/remover mentores dos favoritos
- Seção dedicada "Meus Favoritos"
- Persistência no navegador

## 🏗️ Estrutura do Projeto

```
educonnect/
├── index.html          # Página principal
├── styles.css          # Estilos e responsividade
├── app.js              # Funcionalidades JavaScript
├── data/
│   └── mentors.json    # Dados dos mentores (mock)
├── assets/             # Imagens e ícones
└── README.md           # Documentação
```

## 🚀 Como Rodar Localmente

### Opção 1: Abrir Diretamente
1. Clone ou baixe o projeto
2. Abra o arquivo `index.html` em qualquer navegador moderno
3. A aplicação funcionará completamente offline

### Opção 2: Servidor Local (Recomendado)
Para evitar problemas com CORS ao carregar o JSON:

```bash
# Com Python
python3 -m http.server 5000

# Com Node.js (se tiver http-server instalado)
npx http-server -p 5000

# Com PHP
php -S localhost:5000
```

Acesse: `http://localhost:5000`

## 📱 Responsividade

A aplicação é totalmente responsiva:
- **Desktop**: Grid de 3 colunas para mentores
- **Tablet**: Grid de 2 colunas  
- **Mobile**: Grid de 1 coluna com menu hambúrguer

## ♿ Acessibilidade

Implementações para acessibilidade:
- Landmarks semânticos (`nav`, `main`, `section`)
- Atributos ARIA (`aria-label`, `aria-live`, `aria-modal`)
- Labels associadas aos campos de formulário
- Estados de foco visíveis
- Trap de foco em modais
- Contraste adequado de cores
- Navegação por teclado

## 🔧 Estrutura dos Dados (mentors.json)

Cada mentor segue esta estrutura:

```json
{
  "id": 1,
  "name": "Nome do Mentor",
  "area": "Área de Especialização",
  "price": 85,
  "rating": 4.9,
  "photo": "URL_da_foto",
  "bio": "Biografia detalhada...",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "city": "Cidade, Estado",
  "attendance": "online|presencial|hibrido",
  "availability": [
    {
      "day": "Segunda",
      "slots": ["09:00", "14:00", "16:00"]
    }
  ]
}
```

### Como Editar os Dados

1. Abra o arquivo `data/mentors.json`
2. Siga a estrutura mostrada acima
3. Para adicionar um mentor, copie um existente e modifique os campos
4. Para remover, delete o objeto completo
5. Certifique-se de manter a sintaxe JSON válida

## 🌐 Como Publicar no GitHub Pages

1. **Crie um repositório no GitHub**
2. **Faça upload dos arquivos**
3. **Configure o GitHub Pages**:
   - Vá em Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
4. **Aguarde alguns minutos**
5. **Acesse**: `https://seu-usuario.github.io/nome-do-repositorio`

## 💾 Estados da UI

- **Loading**: Skeleton animado durante carregamento
- **Empty State**: Mensagem quando não há resultados
- **Error State**: Tratamento amigável de erros
- **Paginação**: Botão "Carregar mais" para performance

## 🎨 Design System

### Cores Principais
- **Primária**: `#2563eb` (azul)
- **Hover**: `#1d4ed8`
- **Sucesso**: `#059669`
- **Erro**: `#dc2626`

### Componentes
- Cards com sombra suave e bordas arredondadas
- Botões com estados hover/focus
- Modal acessível com backdrop blur
- Grid responsivo com breakpoints

## 📋 Regras de Desenvolvimento

- ✅ **Sem frameworks** (Bootstrap, Tailwind, React, etc.)
- ✅ **Código comentado** e bem organizado
- ✅ **Funções nomeadas** (renderMentors, applyFilters, etc.)
- ✅ **Compatibilidade** desktop e mobile
- ✅ **Acessibilidade** (WCAG 2.1)
- ✅ **Performance** otimizada

## 🔄 Funcionalidades Implementadas

- [x] Navbar fixa com menu responsivo
- [x] Sistema de busca e filtros
- [x] Renderização dinâmica de mentores
- [x] Sistema de favoritos
- [x] Modal de perfil detalhado
- [x] Formulário de agendamento
- [x] Grupos de estudo
- [x] Paginação client-side
- [x] Estados de loading/empty/error
- [x] Acessibilidade completa
- [x] Responsividade total

## 📊 Performance

- **Carregamento otimizado** com lazy loading de imagens
- **Debounce** nos campos de busca (300ms)
- **Paginação** para melhor performance
- **localStorage** para persistência local
- **CSS otimizado** com variáveis

## 🔍 SEO

- Meta tags apropriadas
- Estrutura HTML semântica
- Alt text em imagens
- Títulos hierárquicos corretos

## 🧪 Testado Em

- ✅ Chrome 120+
- ✅ Firefox 115+
- ✅ Safari 16+
- ✅ Edge 120+
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## 📝 Logs de Desenvolvimento

O projeto foi desenvolvido seguindo as melhores práticas:

1. **Estrutura HTML** semântica e acessível
2. **CSS responsivo** com grid flexível
3. **JavaScript modular** com funções bem definidas
4. **Dados mock** realistas e estruturados
5. **Testes** em múltiplos dispositivos

---

**EduConnect** - Conectando mentores e estudantes para um futuro melhor! 🚀