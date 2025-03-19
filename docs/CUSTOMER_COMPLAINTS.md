# Sistema de Reclamação de Clientes

## Visão Geral
O sistema de reclamação de clientes é uma nova funcionalidade implementada na versão v1.005 (19/03/2025) do Simulador PCP. Esta funcionalidade adiciona um elemento de realismo ao jogo, onde os clientes expressam sua insatisfação quando os pedidos não são entregues dentro do prazo estabelecido.

## Funcionalidades

### 1. Pop-up de Reclamação
Quando um pedido não é entregue no prazo, um pop-up será exibido automaticamente, mostrando:
- Uma imagem aleatória de um cliente insatisfeito
- Uma mensagem de reclamação aleatória
- Detalhes do pedido atrasado
- Um temporizador de 30 segundos para tomar uma decisão

### 2. Opções de Resposta
O jogador tem duas opções para lidar com a reclamação:
- **Negociar Novo Prazo**: Estende o prazo em 3 dias, mas aplica uma penalidade de 20% no valor da recompensa
- **Cancelar Pedido**: Cancela o pedido, mas aplica uma penalidade financeira de 50% do valor da recompensa

### 3. Temporizador
Um temporizador de 30 segundos força o jogador a tomar uma decisão rápida. Se o tempo expirar, o pedido será automaticamente cancelado com a penalidade aplicada.

## Impacto no Jogo
- Adiciona um elemento de pressão e realismo à gestão de pedidos
- Incentiva o planejamento adequado da produção para evitar atrasos
- Introduz consequências financeiras para o não cumprimento de prazos

## Imagens de Clientes
O sistema utiliza quatro imagens diferentes de clientes, localizadas em:
```
/public/assets/customers/Cliente_01.png
/public/assets/customers/Cliente_02.png
/public/assets/customers/Cliente_03.png
/public/assets/customers/Cliente_04.png
```

## Mensagens de Reclamação
O sistema inclui quatro mensagens diferentes de reclamação:
1. "Isso é inaceitável! Minha empresa está parada esperando essa entrega. Vocês têm noção do prejuízo que estão me causando?"
2. "Eu confiei na sua empresa e vocês me decepcionaram. Como vou explicar esse atraso para os meus clientes agora?"
3. "Já é a segunda vez que isso acontece! Estou considerando seriamente mudar de fornecedor se não resolverem essa situação."
4. "Precisava desse material com urgência! Agora todo meu cronograma está comprometido. O que vocês vão fazer a respeito?"

## Implementação Técnica
- Um novo componente `CustomerComplaintModal.tsx` foi criado para exibir o pop-up de reclamação
- O componente `CommercialDepartment.tsx` foi modificado para detectar pedidos atrasados e exibir o modal
- Arquivos de placeholder para imagens de clientes foram adicionados em `/public/assets/customers/`

## Próximas Melhorias Potenciais
- Adicionar mais variedade de imagens de clientes e mensagens de reclamação
- Implementar diferentes níveis de insatisfação com base no tempo de atraso
- Adicionar um sistema de reputação que afeta a frequência e os termos de novos pedidos
