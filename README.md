Here's the README for **Dungeon Master** in English.

---

# Dungeon Master

## Introduction
**Dungeon Master** is a web application inspired by **Roll20**, a popular online platform for tabletop role-playing games (*Dungeons & Dragons*, *Pathfinder*, etc.). This project aims to provide a **virtual game board** where Game Masters (GMs) and players can run RPG campaigns remotely, just as if they were sitting around the same table.  

With **Dungeon Master**, users can interact via a shared map, manage characters, roll virtual dice, and utilize many other features to facilitate online RPG sessions.

## Technologies Used
This project is built with a **modern web development stack**, including:

- **Spring Boot** – Java framework for the backend, providing a secure REST API and game logic.
- **React** – JavaScript library (used with TypeScript) to create a dynamic and responsive user interface.
- **MySQL** – Relational database management system to store application data (user accounts, game sessions, character sheets, etc.).
- **TypeScript** – A typed superset of JavaScript used for frontend development, improving code maintainability.

*(Additionally, the project leverages **Docker** and **Docker Compose** for simplified deployment and execution.)*

## Prerequisites
Before running the application, ensure you have the following installed:

- **Docker** – The containerization platform to run the application services.
- **Docker Compose** – The tool for orchestrating multiple containers, typically included with Docker.

## Installation & Execution
Follow these steps to install and run **Dungeon Master** using Docker Compose:

1. **Clone the repository**: Download the project from GitHub.
   ```bash
   git clone https://github.com/your-user/DungeonMaster.git
   cd dungeon-master
   ```
2. **Launch the application**: From the project root (where `docker-compose.yml` is located), run:
   ```bash
   docker-compose up --build
   ```
   This command builds and starts all services, including the Spring Boot backend, React frontend, and MySQL database. *(You can add `-d` to run it in detached mode.)*
3. **Access the application**:
   - The **React frontend** should be available at **http://localhost**.
   - The **Spring Boot API backend** runs on **http://localhost:8080**, but you typically won't need to access it directly (the frontend communicates with it).
4. **Stopping the services**: To stop the application and remove the containers, run:
   ```bash
   docker-compose down
   ```
