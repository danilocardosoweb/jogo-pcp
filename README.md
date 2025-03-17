# Jogo PCP - Simulador de Gestão de Produção

Um jogo de simulação de gestão de produção desenvolvido com tecnologias modernas web, oferecendo uma experiência interativa de gerenciamento de fábrica com visual pixel art.

## Funcionalidades Principais

O jogo é dividido em várias áreas de gestão:

### 1. Recursos
- Sistema de compra e gestão de recursos
- Visualização de estoque em tempo real
- Gerenciamento de custos operacionais

### 2. Planejamento
- Catálogo de produtos disponíveis
- Sistema de pedidos com opções de aceite/rejeição
- Ferramentas de planejamento de produção

### 3. Fábrica
- Compra e gestão de máquinas
- Sistema de manutenção e upgrades
- Controle de produção
- Boosters de produtividade

### 4. Inventário
- Gestão de estoque de produtos
- Sistema de controle de qualidade
- Gerenciamento de armazenamento

### 5. Logística
- Sistema de gerenciamento de entregas
- Acompanhamento de pedidos em tempo real
- Monitoramento de status de envios

### 6. Recursos Humanos
- Sistema de contratação
- Gestão de equipe e treinamentos
- Sistema de motivação
- Alocação dinâmica de trabalhadores

### 7. Finanças
- Controle detalhado de receitas e despesas
- Sistema de empréstimos
- Relatórios financeiros

## Arquitetura e Tecnologias

### Frontend Core
- **React 18** com **TypeScript** para tipagem estática
- **Vite** como bundler e dev server
- **React Router DOM** para navegação entre páginas
- **React Query** para gerenciamento de estado e cache

### UI/UX
- **Tailwind CSS** para estilização responsiva
- **shadcn/ui** para componentes base
- **Radix UI** para primitivos de interface acessíveis
- Sistema de temas com **next-themes**
- Animações com **tailwindcss-animate**
- Notificações com **Sonner**

### Componentes Especializados
- **Recharts** para gráficos e visualizações
- **date-fns** para manipulação de datas
- **React Hook Form** com **Zod** para validação de formulários
- **Embla Carousel** para carrosséis
- **React Resizable Panels** para painéis ajustáveis

### Estrutura do Projeto
```
src/
├── components/     # Componentes reutilizáveis
├── context/       # Contextos React
├── hooks/         # Hooks customizados
├── lib/           # Utilitários e configurações
├── pages/         # Páginas da aplicação
├── styles/        # Estilos globais
└── types/         # Definições de tipos TypeScript
```

### Design System
- Paleta de cores otimizada para pixel art
- Sistema de contraste aprimorado:
  - Cartões com bordas intensificadas (500)
  - Fundos contrastantes (100)
  - Textos em tons escuros (800/900)
  - Efeitos hover suaves
  - Bordas inativas em tons médios (300)

## Instalação e Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Executar linting
npm run lint
```

## Status de Implementação

### Implementado
- Interface principal com estilo pixel art
- Sistema de gerenciamento de recursos
- Mecânicas de energia e eficiência
- Controles de produção e manutenção
- Sistema de cumprimento de pedidos
- Componentes UI personalizados
- Sistema de tutorial

### Em Desenvolvimento
- Sistema de conquistas
- Sprites pixel art adicionais:
  - Fábrica
  - Moedas
  - Trabalhadores
  - Máquinas
  - Energia
  - Pedidos
- Sistema de save/load
- Efeitos sonoros e música
- Estatísticas detalhadas de produção

## Como Jogar

1. Comece com o tutorial para aprender os conceitos básicos
2. Gerencie seus recursos iniciais com sabedoria
3. Aceite pedidos compatíveis com sua capacidade
4. Expanda sua fábrica gradualmente
5. Mantenha o equilíbrio entre produção e custos
6. Desenvolva sua equipe e infraestrutura

## Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request
