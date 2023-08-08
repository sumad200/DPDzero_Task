# DPDzero Take home assignment

This repository contains a Node.js/Express solution for the DPDzero API assignment, the assignment requirements and the
API endpoint documentation can be found [here](https://bit.ly/dpdzero-fullstack-engg)

## Project Overview

- ### Backend framework

  The backend is written in JavaScript (Node.js). Express is the framework of choice due to the following reasons:

  - Excellent Community support
  - Easy to write middleware
  - Large number of utility packages and libraries, courtesy of npm
  - Wide selection of ORMs (This project uses Prisma)

- ### Database Schema

  This project uses PostgreSQL as the database. As this project uses Prisma ORM, it can be easily replaced with any other database supported by Prisma by simply changing the provider in `schema.prisma` file, editing the `DATABASE_URL` environment variable in `docker-compose.yml` with the correct connection string and making other necessary changes.

  The database schema is as follows:

  - Users Table to store the registered users' data

  <br/>

  ```sql
  CREATE TABLE "Users" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
    );
  ```

  <br/>

  - kvPairData table to store the key value pairs inserted by the users

   <br/>

  ```sql
  CREATE TABLE "kvPairData" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "kvPairData_pkey" PRIMARY KEY ("key")
  );
  ```

## Getting Started

To set up the project locally, follow these simple steps.

### Prerequisites

- Make sure that Docker is installed and it is running.

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/sumad200/DPDzero_Task.git
   ```

2. Navigate to the project directory

   ```sh
   cd DPDzero_Task
   ```

3. Ensure that docker daemon is running and execute the following command to build the images

   ```sh
   docker compose up
   ```

   This may take a few minutes.

4. Once the containers are up and running, the last output in the terminal should be as follows:

   ```sh
   dpdzero_task-api-1  | DPD Zero Task Running on port 6900
   ```

5. The application can now be accessed on port `6900` on your host machine.

## Usage

If the setup was successful, visiting <http://localhost:6900/> on your web browser or making a `GET` request to <http://localhost:6900/> should return the following JSON response:

```json
{
  "hello": "dpdZero task running"
}
```

If you get the above response, you have successfully set up the project locally and can make requests to the API, the documentation for the available endpoints can be viewed [here](https://dpdzero.notion.site/Take-home-assignment-Software-Developer-a1354d18891744fa9fc84815f040c76d?pvs=25#694d7900382a43fbbe54bafa95e2628a) It is recommended to use an API client like Postman or Insomnia to make requests easily.
