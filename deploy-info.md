# Deploy Info

## Imagens Docker (GHCR)

As imagens são publicadas automaticamente no GitHub Container Registry a cada push na `main`:

- Backend: `ghcr.io/analeticiaa/trabalho-final-gces-ana-leticia/backend:latest`
- Frontend: `ghcr.io/analeticiaa/trabalho-final-gces-ana-leticia/frontend:latest`

## Frontend (HTTPS)

O frontend é publicado automaticamente via GitHub Pages com HTTPS:
- URL: `https://analeticiaa.github.io/Trabalho-Final-GCES-Ana-Leticia`

## Como usar as imagens publicadas

```bash
# Baixar e rodar o backend
docker pull ghcr.io/analeticiaa/trabalho-final-gces-ana-leticia/backend:latest
docker run -p 55555:55555 ghcr.io/analeticiaa/trabalho-final-gces-ana-leticia/backend:latest

# Baixar e rodar o frontend
docker pull ghcr.io/analeticiaa/trabalho-final-gces-ana-leticia/frontend:latest
docker run -p 80:80 ghcr.io/analeticiaa/trabalho-final-gces-ana-leticia/frontend:latest
```