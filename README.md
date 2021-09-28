# Acala Subquery Starter

This starter project will get you started with everything you need to begin building a custom Subquery project for Acala/Karura. For more general information on Subquery check out their docs [here](https://doc.subquery.network/).

## Setup

Make sure you have the pre-requisite software installed by following the directions [here](https://doc.subquery.network/quickstart/helloworld-localhost/#pre-requisites).


### Building/Starting the Project

1. Clone this repo and install the dependencies by running `yarn` in the project directory
2. Update the custom type definitions for Acala, Karura, and Mandala in the `project.yaml` by running `yarn update-types`
3. Generate the schema types for use in your handlers by running `yarn codegen`
4. Build the project by running `yarn build`
5. Start the prooject by running `docker-compose pull && docker-compose up`

#### Query the project

Open your browser and head to `http://localhost:3000`.

Finally, you should see a GraphQL playground is showing in the explorer and the schemas that ready to query.

For the `subql-starter` project, you can try to query with the following code to get a taste of how it works.

```graphql
query{
  starterEntities(first:10){
    nodes{
      field1
      field2
      field3
      field4
      field5
    }
  }
}
```
