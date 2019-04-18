<p align="center">
  <a href="https://memoirre.herokuapp.com/" target="blank"><img src="https://res.cloudinary.com/ddufn6ug6/image/upload/v1554277089/memoire-logo-name.png" width="200" alt="Memoire Logo" /></a>
</p>

  <p align="center">Memoire is an online journal where users can pen down their thoughts and feelings. The Memoire WebAPI is powered by <a href="http://nestjs.com/" target="blank" title="A progressive Node.js framework for building efficient and scalable server-side applications, heavily inspired by Angular.">NestJS</a>.</p>
    <p align="center">
    <img src="https://img.shields.io/badge/npm-v6.9.0-blue.svg" alt="NPM Version" />
    <a href="https://nestjs.com" target="_blank"><img src="https://img.shields.io/badge/nestjs-5.4.0-orange.svg" alt="NestJS" /></a>
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="Package License" />
    <img src="https://travis-ci.com/krizten/Memoire-API.svg?token=NkFAritBep7j1WfW851H&branch=dev1" alt="Travis" />
  </p>

## Technologies Used 👨‍💻

- ##### Server Application
  - [Node.js®](https://nodejs.org/en/), a JavaScript runtime built on Chrome's V8 JavaScript engine.
  - [NestJS](https://nestjs.com), a progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.
  - [JSON Web Token (JWT)](https://jwt.io/) for token-based authenication.
  - [PostgreSQL](https://www.postgresql.org/), an open source object-relational database system.
  - [TypeORM](https://typeorm.io), an ORM that can run in NodeJS, Browser, Cordova, PhoneGap and Ionic platforms and can be used with TypeScript and JavaScript.
  - [Amazon S3](https://aws.amazon.com/s3/), a scalable, high-speed, low cost, web-based service designed for backup and archiving of data.
- ##### Project Management
  - [Pivotal Tracker](https://pivotaltracker.com), agile project management tool of choice for developers, was used in managing this [project](https://www.pivotaltracker.com/n/projects/2266427).
  - [Docker](https://www.docker.com/) & [Docker-Compose](https://docs.docker.com/compose/), a container technology, was applied to serve up the server application and database in separate but connected containers.
- ##### Testing
  - [Postman](https://www.getpostman.com/), a complete API development environment, and flexibly integrates with the software development cycle for API testing.

## Installation 🏗️

- ##### Basic Installation

  - Install [Node.js®](https://nodejs.org/en/) and [PostgreSQL](https://www.postgresql.org/) on your host environment (or PC).
  - Create a Postgres database with the name: `memoiredb` or any appropriate name. Note the host, port, username and password of the database.
  - Ensure [Git](https://git-scm.com/) is installed, then clone this [repository](https://github.com/krizten/Memoire-API) by running `git clone https://github.com/krizten/Memoire-API.git` in the terminal.
  - Install the project dependencies by running `npm install`
  - Create a .ENV file, using the [.env.example](.env.example) as a sample fill all the fields with correct data.
  - Ensure the database service is running, then start the server application in development mode by running `npm run start:dev`
  - Use the [API documentation](https://memoirre.herokuapp.com/docs) to see available endpoints.

- ##### Installing With Docker 🐳
  - Install [Docker](https://www.docker.com/) and [Docker-Compose](https://docs.docker.com/compose/) on your host environment (or PC).
  - Clone this [repository](https://github.com/krizten/Memoire-API) by running `git clone https://github.com/krizten/Memoire-API.git` in the terminal.
  - Open the [docker-compose.yml](docker-compose.yml), then note the database name, host, port, username and password.
  - Create a .ENV file, using the [.env.example](.env.example) as a sample fill all the fields with correct data.
  - Start the application in development mode by running `docker-compose up`

## API Endpoints Documentation 📚

Some of the available endpoints are listed below.

- `POST /api/v1/auth/signup :-->`  Sign up a new user
- `POST /api/v1/auth/login :-->` Log in an existing user
- `GET /api/v1/entries :-->` Get all diary entries made by the user
- `POST /api/v1/entries :-->` Create a new diary entry
- `PUT /api/v1/entries/{id} :-->` Update an existing diary entry
- `DELETE /api/v1/entries/{id} :-->` Delete a diary entry
- `GET /api/v1/account :-->` Retrieve user's account details
- `POST /api/v1/uploads/avatar :-->` Upload a new avatar for the user
<br>
See complete documentation [here](https://memoirre.herokuapp.com/docs).

## Testing 🚨

- ##### Testing with Postman
  - Install [Postman](https://www.getpostman.com/) or any preferred REST API Client such as [Insomnia](https://insomnia.rest/), [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client), etc.
  - Get the application up and running by following the instructions in the _Installation Guide_ of this README.
  - Use the [API documentation](https://memoirre.herokuapp.com/docs) as a guide to access available endpoints.

## Deployment (Production) 🚀
For demonstration purposes, the Memoire WebAPI was deployed to [Heroku](https://www.heroku.com/) using the [free cloud hosting plan](https://www.heroku.com/free) bundled with free dyno hours and several options for data storage.

##### Hosting with Heroku
  - Create an account with [Heroku](https://signup.heroku.com/) or [log in](https://id.heroku.com/) if you already have an account.
  - Download and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) matching your operating system.
  - Clone this [repository](https://github.com/krizten/Memoire-API) using `git clone https://github.com/krizten/Memoire-API.git`
  - In your project root directory, run the command `heroku login` and supply the right credentials.
  - With a working Docker installation, log in to Container Registry using `heroku container:login`
  - Create a Heroku app by running `heroku create <app-name>`.
  - Visit [Heroku Addons](http://elements.heroku.com/addons) to add PostgreSQL addon to the app. The connection string added to the app is usually of the format `postgres://YourUserName:YourPassword@YourHost:5432/YourDatabase`.
  - Navigate to the settings area of the newly created app and use the `Config Vars` to add necessary environment variables (see [.env.example](.env.sample)).
  - Build the image from the [Dockerfile](Dockerfile) and push to Container Registry using `heroku container:push web`.
  - Release the image to the app using `heroku container:release web`.
  - To access the deployed app, run `heroku open` which opens the app in your default browser.

## Improvements ✨

- ##### Technologies
  - Integrate <abbr title="Continuous Integration & Delivery">CI/CD</abbr> for a better workflow management.
  - Automated testing for faster bug discovery and debugging.
  - Integrate <abbr title="WebSocket is a computer communications protocol, providing full-duplex communication channels over a single TCP connection.">WebSockets</abbr> on server and clients to reduce HTTP requests and improve on server availability.
  - Layering <abbr title="GraphQL is an open-source data query and manipulation language for APIs, and a runtime for fulfilling queries with existing data.">GraphQL</abbr> on existing REST API to enjoy the <a href="https://blog.apollographql.com/layering-graphql-on-top-of-rest-569c915083ad#14d5" target="_blank">benefits of GraphQL</a>.
- ##### Features
  - Verify user's account/email to prevent bots from registering.
  - Tracking usage history (last seen and time spent on the app).

## Licence 🔐

**[MIT licensed](LICENSE) © [Christian Effiong](https://github.com/krizten)**

## Credits 🙏

- [Wait-For shell script](https://github.com/eficode/wait-for) by [Eficode](https://github.com/eficode)
- [UUID regex code snippet](https://gist.github.com/bugventure/f71337e3927c34132b9a) by [Jake Taylor](https://gist.github.com/jakewtaylor)
