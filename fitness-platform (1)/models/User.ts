import mongoose from "mongoose"

// Definindo o schema do usuário
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Por favor, forneça um nome"],
    maxlength: [60, "Nome não pode ter mais de 60 caracteres"],
  },
  email: {
    type: String,
    required: [true, "Por favor, forneça um email"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Por favor, forneça um email válido"],
  },
  phone: {
    type: String,
    required: [true, "Por favor, forneça um telefone"],
  },
  birthdate: {
    type: Date,
    required: [true, "Por favor, forneça uma data de nascimento"],
  },
  password: {
    type: String,
    required: [true, "Por favor, forneça uma senha"],
    minlength: [6, "Senha deve ter pelo menos 6 caracteres"],
  },
  program: {
    type: String,
    enum: ["rehabilitation", "sedentary", "training-diet"],
    default: null,
  },
  programData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Verificar se o modelo já existe para evitar erros de overwrite
export default mongoose.models.User || mongoose.model("User", UserSchema)
