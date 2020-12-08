# LuhVendas
<p align="center">Sistema de controle de vendas e cadastro de compras para apresentação na disciplina de Sistemas Corporativos</p>
<h4 align="center"> 
	✅ Finalizado v1
</h4>

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Node.js](https://nodejs.org/en/) e [PostgreSQL](https://www.postgresql.org/).

### 🎲 Clonando o repositório
```bash
# Clone este repositório
$ git clone https://github.com/mateuseduardomedeiros/luhvendas-dsc.git
```
Após instalar as ferramentas e clonar o repositório, crie um banco de dados com o nome `luhvendas` e configure os campos `username`, `password` e demais campos necessários do arquivo `ormconfig.json` dentro da pasta `backend`

### 🎲 Rodando o Backend (servidor)
```bash

# Acesse a pasta do backend
$ cd luhvendas-dsc/backend/

# Utilize a versão do Node.js v14.2.0 a qual foi desenvolvida esse projeto
# Instale manualmente ou se utilizar o nvm use o comando
$ nvm use

# Instale as dependências
$ npm i

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# Com a aplicação em execução, adicione as migrations
$ npm run migration:run

# O servidor iniciará na porta definida do arquivo .env ou 3000. Acesse http://localhost:3000/v1/
# Se tudo ocorrer bem, você terá o retorno {"msg":"LuhVendas API v1"}
```

### 💚 Rodando o Frontend (cliente)

```bash
# Acesse a pasta do fronted
$ cd luhvendas-dsc/frontend/

# Instale as dependências
$ npm i

# Execute a aplicação
$ npm run serve

# O frontend será iniciado na porta 8080. Acesse http://localhost:8080/
```

### 💁‍ Para o professor
Usuário: `gustavo`
Senha: `gustavo00`

Todas as rotas do sistema estão protegidas e precisam de um jwt token para ser acessadas.


### 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [PostgreSQL](https://www.postgresql.org/)
- [Node.js](https://nodejs.org/en/)
- [TypeORM](https://typeorm.io/#/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vue.js](https://vuejs.org/)
