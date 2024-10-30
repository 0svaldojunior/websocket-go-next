# Websocket GO Next.js Project

This project is a full-stack application with a Go server and a Next.js front-end, utilizing websockets for real-time communication.

## Technologies

- **Server (Go)**: Backend implementation using Go, with SQLC for the database layer and Gorilla WebSocket for real-time communication.
- **Client (Next.js)**: Front-end application built with Next.js and React, supporting websocket connections.

## Project Structure

- **server**: Contains the Go backend code.
- **web**: Contains the Next.js front-end.
- **docker-compose.yml**: Docker configurations to initialize database services (PostgreSQL) and pgAdmin.

## Setup

1. **Environment Variables**: Copy the `.env` file into the necessary folders and configure environment variables such as database details and websocket settings.

2. **Installation and Startup**:

   - **Back-end**: Navigate to the `server` folder and run:
     ```bash
     go mod tidy
     go generate ./...
     go run ./cmd/websocket/main.go
     ```

   - **Front-end**: Navigate to the `web` folder and run:
     ```bash
     pnpm install
     pnpm dev
     ```

3. **Database**: Use `docker-compose` to initialize the PostgreSQL database and pgAdmin.
   ```bash
   docker-compose up -d


# Websocket GO Next.js Project

Este projeto é uma aplicação full-stack com um servidor em Go e um front-end em Next.js, usando websockets para comunicação em tempo real.

## Tecnologias

- **Server (Go)**: Implementação do backend usando Go, com SQLC para a camada de banco de dados e Gorilla WebSocket para comunicação em tempo real.
- **Client (Next.js)**: Aplicação front-end utilizando Next.js e React com suporte a websockets.

## Estrutura do Projeto

- **server**: Contém o código backend em Go.
- **web**: Contém o front-end em Next.js.
- **docker-compose.yml**: Configurações do Docker para inicializar os serviços de banco de dados (PostgreSQL) e pgAdmin.

## Configuração

1. **Variáveis de Ambiente**: Copie o arquivo `.env` nas pastas necessárias e configure as variáveis de ambiente, como detalhes do banco de dados e configurações do websocket.

2. **Instalação e Inicialização**:

   - **Back-end**: Navegue até a pasta `server` e execute:
     ```bash
     go mod tidy
     go generate ./...
     go run ./cmd/websocket/main.go
     ```

   - **Front-end**: Navegue até a pasta `web` e execute:
     ```bash
     pnpm install
     pnpm dev
     ```

3. **Banco de Dados**: Use `docker-compose` para inicializar o banco de dados PostgreSQL e o pgAdmin.
   ```bash
   docker-compose up -d
