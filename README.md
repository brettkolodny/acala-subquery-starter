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

### Query the project

Open your browser and head to `http://localhost:3000`.

Write the following query into the query editor and press play. If you see data pop up on the right side then you're all set up! 

```graphql
query {
  tokenTransfers(first: 10) {
    nodes {
      to
      from
      amount
      token
    }
  }
}
```

## Next Steps

This project is just to get you started building with Subquery for Acala/Karura. You'll want to read through the [Subquery docs](https://doc.subquery.network/) for more information on how to build out your own custom handlers.