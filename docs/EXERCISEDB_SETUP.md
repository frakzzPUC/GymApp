# Configuração da ExerciseDB API

## Passos para configurar:

### 1. Obter Chave da API
1. Acesse: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
2. Clique em "Subscribe to Test"
3. Escolha um plano (Basic é gratuito com 100 requests/mês)
4. Copie sua X-RapidAPI-Key

### 2. Configurar no projeto
Adicione a chave no arquivo `.env.local`:

```bash
EXERCISEDB_API_KEY=sua_chave_rapidapi_aqui
```

### 3. Testar a API

#### Endpoints disponíveis:

- **Todos os exercícios:**
  ```
  GET /api/exercisedb?action=all&limit=20&offset=0
  ```

- **Buscar por nome:**
  ```
  GET /api/exercisedb?action=search&query=push+up
  ```

- **Por parte do corpo:**
  ```
  GET /api/exercisedb?action=bodyPart&query=chest
  ```

- **Por músculo alvo:**
  ```
  GET /api/exercisedb?action=target&query=pectorals
  ```

- **Por equipamento:**
  ```
  GET /api/exercisedb?action=equipment&query=dumbbell
  ```

- **Exercício específico:**
  ```
  GET /api/exercisedb?action=exercise&query=0001
  ```

- **Listar categorias:**
  ```
  GET /api/exercisedb?action=bodyPartsList
  GET /api/exercisedb?action=targetsList  
  GET /api/exercisedb?action=equipmentsList
  ```

### 4. Estrutura de dados

Cada exercício retorna:
```typescript
{
  "id": "0001",
  "name": "3/4 sit-up", 
  "target": "abs",
  "secondaryMuscles": ["hip flexors"],
  "instructions": ["Lie down...", "Engage core..."],
  "gifUrl": "https://v2.exercisedb.io/image/...",
  "equipment": "body weight",
  "bodyPart": "waist"
}
```

### 5. Recursos incluídos

✅ **1300+ exercícios** com GIFs animados  
✅ **Tradução automática** para português  
✅ **Instruções detalhadas** passo a passo  
✅ **Filtros múltiplos** (corpo, músculo, equipamento)  
✅ **Fallback system** para GIFs indisponíveis  
✅ **Interface responsiva** para todos dispositivos

### 6. Limites do plano gratuito

- **100 requests/mês** no plano Basic (gratuito)
- **1000 requests/mês** no plano Pro ($7.99/mês)
- **10000 requests/mês** no plano Ultra ($19.99/mês)

### 7. Testes

Para testar se está funcionando:

1. Acesse: `http://localhost:3000/test-videos`
2. Ou use os endpoints da API diretamente
3. Verifique os logs no console para debugar erros

### 8. Troubleshooting

**Erro 401 (Unauthorized):**
- Verifique se a chave da API está correta
- Confirme se está no arquivo .env.local
- Reinicie o servidor de desenvolvimento

**Erro 429 (Rate Limit):**
- Você excedeu o limite de requisições
- Aguarde ou faça upgrade do plano

**GIFs não carregam:**
- URLs dos GIFs são dinâmicas
- Sistema de fallback está ativo
- Verifique conexão com internet