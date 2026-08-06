# 🔌 Documentação da API REST

A API do AntGravity Studio é estruturada seguindo o padrão RESTful. A comunicação é feita em formato JSON.

## 🔑 Autenticação

A maioria dos endpoints requer autenticação do tipo **Bearer Token (JWT)** enviada através do cabeçalho `Authorization`:

```http
Authorization: Bearer <seu_token_jwt>
```

---

## 📁 Endpoints de Projetos

### 1. Criar Projeto
- **Rota:** `POST /api/projects`
- **Cabeçalhos:** `Content-Type: application/json`

**Body da Requisição:**
```json
{
  "name": "Canal de Curiosidades Espaciais",
  "niche": "Ciência",
  "language": "pt-BR",
  "theme": "dark_modern"
}
```

**Exemplo de Resposta (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "e2a3c748-0cf2-44fe-98d1-678a2e5d9a9b",
    "userId": "d7c8d9e0-1122-3344-5566-778899aabbcc",
    "name": "Canal de Curiosidades Espaciais",
    "niche": "Ciência",
    "language": "pt-BR",
    "theme": "dark_modern",
    "config": {},
    "createdAt": "2026-08-05T20:00:00.000Z",
    "updatedAt": "2026-08-05T20:00:00.000Z"
  }
}
```

---

### 2. Listar Projetos
- **Rota:** `GET /api/projects?page=1&limit=10`

**Exemplo de Resposta (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "e2a3c748-0cf2-44fe-98d1-678a2e5d9a9b",
      "name": "Canal de Curiosidades Espaciais",
      "niche": "Ciência",
      "videos": []
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## 🎬 Endpoints de Vídeos

### 3. Iniciar Geração de Vídeo
Gera roteiro, áudio, busca mídia externa e renderiza o vídeo em background.
- **Rota:** `POST /api/videos/generate`

**Body da Requisição:**
```json
{
  "projectId": "e2a3c748-0cf2-44fe-98d1-678a2e5d9a9b",
  "tema": "Buracos negros e distorção do tempo",
  "palavras": ["gravidade", "tempo", "relatividade"]
}
```

**Exemplo de Resposta (202 Accepted):**
```json
{
  "success": true,
  "data": {
    "videoId": "fc5678ab-9012-3456-7890-abcdef123456",
    "status": "pending",
    "message": "Geração de vídeo iniciada. Acompanhe pelo status."
  }
}
```

---

### 4. Consultar Status do Vídeo
Consulta o progresso da pipeline do vídeo.
- **Rota:** `GET /api/videos/:id/status`

**Exemplo de Resposta (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "fc5678ab-9012-3456-7890-abcdef123456",
    "status": "done",
    "duracao": 45,
    "videoPath": "/app/uploads/rendered/render_1722880000.mp4",
    "updatedAt": "2026-08-05T20:01:30.000Z"
  }
}
```

---

## ⚠️ Códigos de Erro Comuns

| Código HTTP | Erro / Code | Significado |
| :--- | :--- | :--- |
| **400 Bad Request** | `MISSING_FIELDS` | Um ou mais campos obrigatórios não foram fornecidos no body. |
| **401 Unauthorized** | `AUTH_TOKEN_EXPIRED` | O token fornecido expirou. Solicite um novo token. |
| **404 Not Found** | `PROJECT_NOT_FOUND` | O id do recurso pesquisado não existe ou pertence a outro usuário. |
| **422 Unprocessable** | `VALIDATION_ERROR` | Um erro de validação do banco de dados (ex: e-mail duplicado) ocorreu. |
| **500 Internal Error**| `INTERNAL_ERROR` | Algum erro não esperado ocorreu no servidor. |
