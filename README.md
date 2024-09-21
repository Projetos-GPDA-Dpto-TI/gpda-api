# GPDA-API

Está é a API do website da GPDA, todas as rotinas do back-end são implementadas em forma de API REST aqui
- O repo adota o padrão de commits do [`conventional commmits`](https://www.conventionalcommits.org/en/v1.0.0/#summary)

## Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL (banco de dados relacional)
- Eslint (linting)
- Jest (testes automatizados)

## Ferramentas necessárias para o projeto

- Runtime: [Nodejs](https://nodejs.org/en), (versão original do projeto: `lts/iron`)
- Conteinerização: [Docker](https://www.docker.com/) v27 e [Docker Compose](https://docs.docker.com/engine/reference/commandline/compose/) v2
- Sistema Operacional: Recomendado usar linux (não é garantido o bom funcionamento em ambientes windows) dica: usar codespaces caso nao tenha linux instalado em sua máquina

## Rodando o projeto

Com as ferramentas necessárias instaladas, clone o repositório

```sh
# Clone o repositório
git clone https://github.com/Projeto-Stratum/gpda-api.git

# Vá para o diretório do repositório
cd gpda-api

# Instale as dependências no diretório raiz
npm i

# Certifique-se que os testes automatizados estäo rodando corretamente
npm test

# De `start` no projeto
npm run dev
```

## Como adicionar novas features ao projeto

```sh
# Crie uma nova branch com o nome da sua feature
git checkout -b [nome da branch]

# Implemente suas features + commit + push
git add -A && git commit -m '[msg do commit seguindo o padrão do `conventional commits`]' && git push -u origin [nome da branch]

# Abra um pull request dentro do GitHub

# Verfique se as rotinas do CI estão passando e espere por revisão do seu código

# Depois disso, seu PR estará pronto para um merge na main
```

## Arquivo json que esquematiza todas as rotas da API (abra o arquivo com o `Insomnia`):

`em construção...`



Quaisquer dúvidas, fico a disposição,

Ass: Nicolas \`grecoww\` Greco
