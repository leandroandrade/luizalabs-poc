# luizalabs-poc
Projeto desafio proposto pela LuizaLabs.

# Visão geral

A proposta do projeto é gerenciar clientes e os produtos que esse possa ter como favoritos. O projeto implementa um conjunto serviços utilizando o
modelo arquitetural REST.

A documentação dos serviços disponibilizados pela API pode ser visualizada [aqui](https://github.com/leandroandrade/luizalabs-poc/tree/main/swagger/)

# Começando

### Requisitos para execução da aplicação

1. Ambiente Docker funcionando na máquina local.

#### Executando a aplicação:

No diretório principal do projeto, executar os comandos abaixo:

1. Construir imagens:
```
docker-compose build
```

2. Iniciar ambiente:
```
docker-compose up -d
```

3. Finalizar ambiente:
```
docker-compose stop
```

### Desenvolvimento em ambiente local

Verificar se possui o Node.js **v10** instalado e inicializar as dependências de infraestrutura que o projeto utiliza, executar os comandos abaixo no diretório raiz:

1. Instalar dependências:
```
npm install
```

2. Iniciar ambiente:
```
docker-compose -f docker-compose-dev.yml up -d
```

3. Finalizar ambiente:
```
docker-compose -f docker-compose-dev.yml stop
```

### Scripts disponíveis:

1. Executar os testes:
```
npm test
```

2. Executar aplicação no ambiente local:
```
npm run dev
```

3. Executar aplicação:
```
npm start
```

### Conectando com o servidor

A aplicação inicializará no endereço base: _http://localhost:3333/api/v1/_

### Outros serviços disponibilizados no ambiente Docker

Base de dados MongoDB: _http://localhost:8082/_

Base de dados Redis: _http://localhost:8081/_

### Exemplos requests

Exemplos dos requests para os serviços que a aplicação disponibiliza estão disponíveis [aqui](https://github.com/leandroandrade/luizalabs-poc/tree/main/postman)

### Autenticação

Todos os serviços disponibilizados pela API necessitam de um token de autenticação válido. Para obter o token, solicitar pelo endereço _http://localhost:3333/api/v1/auth_. Segue abaixo o payload
de autenticação:

```
{
    "username": "luizalabs",
    "password": "luizalabs",
    "role": "ADMIN"
}
```

# Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE.md](https://github.com/steniowagner/bon-appetit-app/blob/master/LICENSE) para obter detalhes
