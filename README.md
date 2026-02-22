# GPDA-API

Está é a API do website da GPDA, todas as rotinas do back-end são implementadas em forma de API REST aqui
- O repo adota o padrão de commits do [`conventional commmits`](https://www.conventionalcommits.org/en/v1.0.0/#summary)

## Tecnologias Utilizadas

- Node.js
- Express.js
- PostgreSQL (banco de dados relacional)
- Eslint (linting)
- Jest (testes automatizados)

## Ferramentas necessárias para rodar o projeto

- Runtime: [Nodejs](https://nodejs.org/en), (versão original do projeto: `lts/iron`)
- Conteinerização: [Docker](https://www.docker.com/) v27 e [Docker Compose](https://docs.docker.com/engine/reference/commandline/compose/) v2
- Sistema Operacional: Recomendado usar linux (não é garantido o bom funcionamento em ambientes windows) dica: usar codespaces caso nao tenha linux instalado em sua máquina

## Rodando o projeto

Com as ferramentas necessárias instaladas:

```sh
# Clone o repositório
git clone https://github.com/Projeto-Stratum/gpda-api.git

# Vá para o diretório do repositório
cd gpda-api

# Instale as dependências
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
Download do arquivo: [Insomnia_2024-10-04.json](https://github.com/user-attachments/files/17319814/Insomnia_2024-10-04.json)

Quaisquer dúvidas, fico a disposição,

Ass: Nicolas \`grecoww\` Greco


## Como adicionar novas tabelas ao projeto ou alterar tabelas existentes
Dentro da pasta infra/migrations/ estão todos os arquivos que esquematizam as tabelas do projeto.
- Para criar uma nova tabela, rode o comendo "npm run migration:create -- create_NOMEDATABELA", substituindo o NOMEDATABELA pelo nome da tabela, usando _ como "espaços"

Para rodar o banco do Docker, siga as seguintes instruções:
- Utilizando o CMD, vá até a pasta infra (usando cd infra a partir da pasta geral)
- Rode o comando "docker compose up -d" --> isso roda o ambiente docker
- Após o OK no CMD, rode o comando "npm run migration:up", isso executará os códigos da pasta infra/migrations/
- Após o OK, já é possível encontrar as tabelas feitas no container. Para acessar o Container, siga o passo a passo comum do docker (docker exec -it nomedocontainer bash; etc)
OBS: último comando do Docker depende de informações que estão no .env, não trackeado no repositório remoto.