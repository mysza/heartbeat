# ubio-heartbeat

This project is a simple heartbeat service, being an output of the [Backend Developer Technical Test](https://github.com/ubio/technical-challenges/tree/main/backend).

## Prerequisites

* Docker ([website](https://www.docker.com/))
* Node & NPM ([website](https://nodejs.org/))

## Installation

```bash
npm install
```

## Usage

The project is written in Typescript, and uses MongoDB as a database.
To start the service, we need to:

* start the database
* compile the service
* create `.env` file
* start the service

The following commands will do all of this:

```bash
cp .env.example .env # copy .env example to .env (defaults are ok)
docker-compose up -d mongo # start mongo
npm run compile # compile the service
npm run start # start the service
```

## Development

### Project framework & structure

The project is built using the [Ubio Node Framework](https://github.com/ubio/node-framework). I tried to follow its philosophy as close as possible :)

The project is structured as follows:

-- node_modules
-- out
-- src
    |-- bin
    |-- main
        |-- http        # routes and request and response schemas (HTTP layer only)
        |-- repos       # repositories - in this case only one, for app instances
        |-- schema      # schemas - the most core application models
        |-- services    # the application services implementation (business logic)
            |-- dto     # DTO definitions for service requests and responses
    |-- test
        |-- e2e         # end-to-end tests with setup/teardown
        |-- unit        # unit tests

All the top level files are the usual project configuration, docker, gitignore, prettier etc. files.

In general, the files and modules are organized in a way that there's a clear dependency path:

* models (in the `schema` folder) don't depend on anything else
* `services` depend only on the models
* `http` and `repos` depend on the models and the service definitions

This makes it clear what is the responsibility of each of the modules, and reduces coupling between modules.

### Notable decisions

1. Not modeling groups as separate entities
   The only real model in the application is the `instance` that is being registered or unregistered from the service. The `group` is just a way to organize the instances, something like a tag. This might change in the future, but I didn't see a point modeling it as a separate entity just now.
2. Endpoints paths
   The endpoints paths proposed in the task are not following the usual convention. It is better to be explicit within the path which resource is being referenced, so I decided to use the following convention:
   `/groups/{groupId}/apps/{appId}`
   This way, the endpoints are more readable and easy to understand.
   This also makes the service more extendable -- if we wanted to add a new resource type to be grouped within the same groups as the applications, it would be easy to do so.
3. Expiring instances
   I think this is not this service responsibility to keep some kind of a CRON setup and do a periodic cleanup of expired instances. I have added a new endpoint `/sweep`, which does exactly what is requested, but it must be called externally to work - using an external CRON service (like AWS EventBridge for example).
   It makes it more reliable, and also horizontally scalable without adding extra configuration specifying which of the multiple services should do the housekeeping (or we'd risk having multiple services doing the same thing, overloading the db).

## Not completed

I didn't manage to complete the e2e testing to the level desirable -- the structure is there and it's enough to define all the test cases and run them.
For this, it would be perhaps desirable to have some database seeding routine.
