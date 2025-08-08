# AI Detective - Text Adventure

Um jogo de aventura noir interativo, onde você é um detetive particular em uma cidade chuvosa e cheia de neon no ano de 1949.

## Pré-requisitos

- **Node.js** (recomendado: versão 18 ou superior)
- **npm** (geralmente instalado junto com o Node.js)
- **Chave de API do Google Gemini**

## Como obter o Node.js

Baixe e instale o Node.js em: https://nodejs.org/

## Como obter a chave da API Gemini

1. Acesse: https://aistudio.google.com/app/apikey
2. Faça login com sua conta Google.
3. Gere uma nova chave e copie o valor.

## Estrutura do Projeto

- `backend/`: Servidor Node.js responsável pela comunicação com a API Gemini.
- `frontend/`: Interface do usuário (HTML, CSS, JS).

## Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/Numbzin/IA-Detetive.git
cd IA-Detetive
```

2. **Configure a chave da API:**

Crie um arquivo `.env` na pasta `backend` com o conteúdo:

```
GEMINI_API_KEY=Sua_Chave_Gemini_Aqui
```

3. **Instale as dependências:**

```bash
cd backend
npm install
cd ../frontend
npm install
```

## Como rodar o projeto

1. **Inicie o backend:**

No diretório `backend`:

```bash
npm start
```

O backend estará rodando em `http://localhost:3000`.

2. **Inicie o frontend:**

No diretório `frontend`, abra o arquivo `index.html` no navegador.

**Dica:** Para evitar problemas de CORS, use uma extensão como [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VS Code:

- Clique com o botão direito em `index.html` e selecione "Open with Live Server".

Ou use outro servidor local de sua preferência.

> **Importante:**
> Certifique-se de que a variável `window.BACKEND_URL` em `frontend/index.html` aponte para o backend (`http://localhost:3000`).

## Como jogar

- Escolha o idioma na tela inicial.
- Siga as instruções e digite comandos para interagir com a história.
- Para iniciar um novo caso, clique em "Iniciar Novo Caso".

## Dúvidas Frequentes

- **Erro de CORS:** Use um servidor local para abrir o frontend.
- **Problemas com a chave Gemini:** Verifique se a chave está correta no arquivo `.env` do backend.
- **Porta ocupada:** Altere a porta do backend em `server.js` se necessário.

## Contribuição

Pull requests são bem-vindos! Para sugestões, abra uma issue.

## Contato

Dúvidas ou sugestões? Entre em contato pelo GitHub ou pelo e-mail do mantenedor.

---

Se precisar de mais alguma informação, é só pedir!
