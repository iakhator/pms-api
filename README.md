[![Build Status](https://travis-ci.org/iakhator/pms-api.svg?branch=master)](https://travis-ci.org/iakhator/pms-api)

# Population Management API
Population Management application provides REST API endpoints for a population management system. It allows create, retrieve, update and delete actions to be carried out.

# API Documentation
The API has predictable, resource-oriented URLs, and uses HTTP response codes to indicate API status and errors. Go to [documentation](https://population-ms-api.herokuapp.com/api-docs/#/)

## Features

**Location**:
- The following can be carried out: 
  - Create Location with population: Parent Location and Sub-Parent location can be created by passing in the following values to a `POST` request via `/api/location`.
  >`Create Parent Location`
  ``` {
      "name": "Abuja",
      "parentId": null or "" ,
      "male": 2,
      "female": 4
    }
  ```
    >`Create sub Parent Location`
  ``` {
      "name": "Abuja",
      "parentId": 94 ,
      "male": 2,
      "female": 4
    }
  ```
  - Retrieve All Locations: Get all locations by calling a `GET` request via `/api/locations`.
  - Update location: You can update locations and its residents by the location Id.
  >`Provide the fields below` then call a `PUT` request via `/api/locations/:id`  the id is the `location id` you want to update
    ```
  {
    "name": "Abuja", //location name
    "male": 2, //male resident number
    "female": 4 //female resident number
  }
  ```
  - Delete Location: You can delete location by Id if the Id matches the location id by call calling a `DELETE` request via `/api/locations/:id`.

## Development
This API is built with the following technologies;

- EcmaScript6 (ES6)
- [NodeJs](https://nodejs.org)
- [Express](http://expressjs.com/)
- [Postgresql](https://www.postgresql.org/)
- [Sequelize ORM](http://docs.sequelizejs.com/en/v3/)

## Installation

- Install [NodeJs](https://nodejs.org/en/) and [Postgres](https://www.postgresql.org/) on your machine
- Clone the repository `$ git clone https://github.com/iakhator/pms-api.git`
- Change into the directory `$ cd /pms-api`
- Install all required dependencies with `$ npm install`

## Set up Database

- run `psql postgres --u postgres` to login into postgres
- create a role `CREATE ROLE <username> WITH LOGIN PASSWORD '<password>';`
- alter the role for the new user `ALTER ROLE <username> CREATEDB;`
- quit postgres `\q`
- run `psql postgres -U <username>;`
- next create the database using `postgres=> CREATE DATABASE <database>;`
- grant user all priivileges to database `postgres=> GRANT ALL PRIVILEGES ON DATABASE <database> TO <username>;`
- quit postgres `\q`
- Create a `.env` file in your root directory as described in `.env-sample` file and replace the data with the database credentials you just created
- run migration `sequelize db:migrate`

## Start for development/Local
```
npm start
it should run on `localhost:3000`
```

## Documentation
```
Run on `localhost:3000/api-docs`
```

## Testing api with Swagger

- To test on local
```
open `swagger.json` change `host` to `host:localhost:3000`
change `https` to `http` in `localhost:3000/api-docs`
```

## Testing

- Open a terminal and navigate to the project directory 
- Add a test database url (DATABASE_URL) to the .env file.(optional)
- Run `npm test`

## LICENSE
 This project is authored by [Itua Akhator](https://github.com/iakhator) it is licensed under the MIT license.
