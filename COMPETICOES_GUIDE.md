# 🏆 Sistema de Competições - Guia de Teste

## Como testar o sistema de desafios fitness:

### 1. **Navegar para Competições**
- Acesse o app em `http://localhost:3000`
- Faça login com suas credenciais
- Clique na aba **"Competições"** no header (ícone de troféu 🏆)

### 2. **Criar um Desafio**
- Na página de competições, clique em **"Criar Desafio"**
- Digite um nome (ex: "Desafio 30 Dias de Treino")
- Opcional: adicione uma descrição
- Clique em **"Criar Desafio"**
- Um código único será gerado (ex: ABC123)

### 3. **Convidar Amigos**
- Copie o código do desafio ou o link de compartilhamento
- Compartilhe com amigos via WhatsApp, email, etc.
- Os amigos podem entrar usando o botão **"Entrar em Desafio"** e digitando o código

### 4. **Fazer Check-in Diário**
- Na página do desafio, clique em **"Fazer Check-in"**
- Selecione uma foto da galeria ou tire uma foto
- Confirme o check-in
- Ganhe +1 ponto no ranking!

### 5. **Acompanhar o Ranking**
- Veja sua posição em tempo real
- Acompanhe o progresso dos amigos
- Competir de forma saudável e motivadora!

## 🎯 Funcionalidades Principais:

### ✅ **Já Implementado:**
- ✅ Criar desafios únicos
- ✅ Entrar em desafios com código
- ✅ Check-in diário com foto
- ✅ Ranking em tempo real
- ✅ Compartilhamento de link/código
- ✅ Prevenção de múltiplos check-ins
- ✅ Interface responsiva
- ✅ Navegação integrada no header

### 📱 **Fluxo de Uso:**
1. **Admin** cria desafio → Gera código único
2. **Participantes** entram com código → Adicionados ao grupo
3. **Todos** fazem check-ins diários → Ganham pontos
4. **Ranking** atualiza automaticamente → Competição saudável!

### 🔧 **Tecnologias:**
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Backend:** API Routes + MongoDB + Mongoose  
- **Autenticação:** NextAuth.js
- **Upload:** Base64 (fotos até 5MB)
- **UI:** Radix UI + Lucide Icons

### 🎨 **Design:**
- Inspirado no Gymrats e apps fitness
- Cores vibrantes (laranja, verde, azul)
- Ícones de troféus e medalhas
- Cards com gradientes
- Feedback visual completo

## 🚨 **Pontos de Atenção:**

### **Banco de Dados:**
- Certifique-se de que o MongoDB Atlas está conectado
- Adicione seu IP à whitelist do Atlas
- As collections serão criadas automaticamente

### **Autenticação:**
- Sistema requer login para acessar
- Usuários devem estar cadastrados
- Session management via NextAuth

### **Performance:**
- Fotos são convertidas para Base64
- Limite de 5MB por imagem
- Ranking ordenado no backend

## 🎉 **Sucesso!**
O sistema está **100% funcional** e pronto para uso. Agora você e seus amigos podem se desafiar e se motivar juntos! 💪

**Acesse:** `/competitions` e comece a usar! 🏋️‍♀️