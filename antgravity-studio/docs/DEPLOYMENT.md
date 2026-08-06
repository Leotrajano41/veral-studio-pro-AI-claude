# 🚀 Guia de Deployment e Produção

Saiba como realizar a implantação de cada um dos pacotes do monorepo AntGravity Studio em ambientes de produção.

---

## 💻 1. Deploy da Web (Next.js) no Vercel

O Vercel é a plataforma recomendada para hospedar a interface Next.js.

### Passos:
1. Conecte sua conta do GitHub ao painel do Vercel.
2. Importe o repositório `antgravity-studio`.
3. Defina as seguintes configurações de build:
   - **Root Directory**: `web`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
4. Adicione as variáveis de ambiente necessárias:
   - `NEXT_PUBLIC_API_URL`: URL de produção da sua API do backend.

---

## ⚙️ 2. Deploy do Backend (Express + FFmpeg) no Railway

O Railway permite subir servidores Node.js com suporte a dependências como FFmpeg facilmente utilizando Dockerfiles.

### Passos:
1. No Railway, crie um novo projeto e conecte com seu repositório do GitHub.
2. Adicione as dependências PostgreSQL e Redis por meio do painel do Railway.
3. Configure o deploy do Backend apontando para o arquivo `Dockerfile` na raiz ou informando a subpasta `backend`.
4. Defina as variáveis de ambiente necessárias:
   - `PORT`: `5000`
   - `DATABASE_URL`: URL de conexão fornecida pelo PostgreSQL do Railway.
   - `REDIS_URL`: URL de conexão fornecida pelo Redis do Railway.
   - `OPENAI_API_KEY`: Sua chave de produção.
   - `GOOGLE_CLOUD_API_KEY`: Sua chave de produção.
   - `JWT_SECRET`: Uma chave secreta longa e segura para as assinaturas dos tokens JWT.

---

## 📱 3. Build e Deploy do App Mobile (EAS Build)

Para publicar o app mobile nas lojas da Apple App Store e Google Play Store, utilizamos o Expo Application Services (EAS).

### Requisitos:
1. Instale a CLI do EAS globalmente:
   ```bash
   npm install -g eas-cli
   ```
2. Efetue login em sua conta do Expo:
   ```bash
   eas login
   ```
3. Inicialize as configurações de build na pasta `mobile`:
   ```bash
   cd mobile
   eas build:configure
   ```

### Gerando as builds de produção:

#### Para Android (AAB):
```bash
eas build --platform android --profile production
```

#### Para iOS (IPA):
```bash
eas build --platform ios --profile production
```
