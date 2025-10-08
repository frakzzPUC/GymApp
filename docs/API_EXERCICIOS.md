# 🏋️ APIs de Exercícios - Guia de Configuração

## 📋 **APIs Disponíveis**

### 1. **API-NINJAS** (Recomendada - Gratuita)
- ✅ **50.000 requests/mês grátis**
- ✅ **Sem limite de exercícios**
- ✅ **Fácil de configurar**
- ❌ **Sem imagens/GIFs**

**Como configurar:**
1. Vá para: https://api.api-ninjas.com/register
2. Crie uma conta gratuita
3. Copie sua API key
4. Adicione no `.env.local`: `API_NINJAS_KEY=sua_chave_aqui`

### 2. **ExerciseDB (RapidAPI)**
- ✅ **1000+ exercícios com imagens/GIFs**
- ✅ **Melhor qualidade visual**
- ❌ **100 requests grátis/mês apenas**
- ❌ **Mais complexo de configurar**

**Como configurar:**
1. Vá para: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb/
2. Crie conta no RapidAPI
3. Subscribe no plano gratuito
4. Copie a X-RapidAPI-Key
5. Adicione no `.env.local`: `RAPIDAPI_KEY=sua_chave_aqui`

## 🚀 **Como Usar**

### **Método 1: Interface Web (Fácil)**
1. Vá para: `http://localhost:3000/exercises`
2. Clique em **"Importar da API"**
3. Aguarde a importação automática
4. ✅ **Pronto!** Centenas de exercícios adicionados

### **Método 2: API Direta**
```bash
# Importar da API-NINJAS
curl -X POST http://localhost:3000/api/exercises/import-ninjas?muscle=chest

# Importar da ExerciseDB
curl -X POST http://localhost:3000/api/exercises/import?bodyPart=chest&limit=20
```

## 📊 **Endpoints Disponíveis**

### **Importar da API-NINJAS** (Gratuita)
```
POST /api/exercises/import-ninjas?muscle=chest&difficulty=beginner
```

**Músculos disponíveis:**
- `chest`, `back`, `shoulders`, `biceps`, `triceps`
- `legs`, `abdominals`, `calves`, `glutes`, `hamstrings`

### **Importar da ExerciseDB** (Premium)
```
POST /api/exercises/import?bodyPart=chest&limit=20
```

**Partes do corpo:**
- `chest`, `back`, `shoulders`, `upper arms`, `lower arms`
- `upper legs`, `lower legs`, `waist`, `cardio`, `neck`

## ⚡ **Importação Rápida (Sem API)**

Se não quiser configurar APIs externas, use os exercícios locais:

```bash
curl -X POST http://localhost:3000/api/exercises/populate
```

Ou clique em **"Popular Exercícios Locais"** na interface.

## 🔧 **Configuração Recomendada**

### **Para Desenvolvimento:**
```bash
# .env.local
API_NINJAS_KEY=sua_chave_api_ninjas
```

### **Para Produção:**
```bash
# .env.production
API_NINJAS_KEY=sua_chave_api_ninjas
RAPIDAPI_KEY=sua_chave_rapidapi  # Opcional
```

## 📈 **Capacidade das APIs**

| API | Exercícios | Imagens | Grátis/Mês | Qualidade |
|-----|------------|---------|------------|-----------|
| **API-NINJAS** | 600+ | ❌ | 50k requests | ⭐⭐⭐ |
| **ExerciseDB** | 1000+ | ✅ GIFs | 100 requests | ⭐⭐⭐⭐⭐ |
| **Local** | 10 | ❌ | Ilimitado | ⭐⭐ |

## 🎯 **Estratégia Recomendada**

1. **Comece** com exercícios locais
2. **Configure** API-NINJAS (gratuita)
3. **Importe** exercícios por categoria
4. **Upgrade** para ExerciseDB se precisar de imagens

## 🛠️ **Troubleshooting**

### **Erro: API Key inválida**
- Verifique se copiou a chave corretamente
- Certifique-se que está no `.env.local`
- Reinicie o servidor: `npm run dev`

### **Erro: Limite da API atingido**
- API-NINJAS: Espere o próximo mês
- ExerciseDB: Upgrade para plano pago
- Use exercícios locais como fallback

### **Exercícios duplicados**
- O sistema automaticamente evita duplicatas
- Baseado no nome do exercício
- Seguro executar múltiplas vezes

## 📞 **Suporte**

Se tiver problemas:
1. Verifique os logs no terminal
2. Teste as APIs diretamente
3. Use exercícios locais como alternativa

---
*Atualizado: Outubro 2025*