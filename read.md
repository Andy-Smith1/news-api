# News Article App

A back-end news application with CRUD operations, built with Nodes.js, Express.js and PSQL. Accessed through an API, users can filter and read news articles, add comments, add upvotes, etc.

The API and all possible endpoints can be accessed [here](https://as-news-articles.herokuapp.com/api).

<br>

---

<br>

## Installation/Setup

<br>

To install locally, clone the repo to your chosen directory. Navigate to the repo run the terminal command below to install the dependencies.

```
npm install
```

Create the following files and paste in the file contents.

- File name: env.test
  - Contents: PGDATABASE=nc_news_test

<br>

- File name: env.development
  - Contents: PGDATABASE=nc_news

Assuming you have PSQL installed, run the below commands to create and seed local databases.

```
npm run setup-dbs
npm run seed
```

To start the server, run the listen command.

```
npm run listen
```

To use the app locally, you can use an API client such as Insomnia or Postman. Alternatively, head to https://localhost:9090/api when the server is running.

<br>

---

<br>

## Testing

<br>

Tests can be viewed/added in the \_\_tests\_\_ directory.

You can run the tests with:

```
npm t
```
