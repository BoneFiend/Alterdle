# Alterdle

Alterdle is an customisable word guessing game, allowing you to choose how many challenges you want to guess at once!

This project forks [cwackerfuss/react-wordle](https://github.com/cwackerfuss/react-wordle), a clone of the popular word guessing game we all know and love. Made using React, Typescript, and Tailwind.

[**Try out the demo!**](https://bonefiend.github.io/alterdle/)

## Build and run

### To Run Locally:

Clone the repository and perform the following command line actions:

```bash
$> cd alterdle
$> npm install
$> npm run start
```

### To build/run docker container:

#### Development

```bash
$> docker compose up
```

or

```bash
$> docker build -t alterdle:dev -f docker/Dockerfile .
$> docker run -d -p 3000:3000 --name atlerdle-dev atlerdle:dev
```

Open [http://localhost:3000](http://localhost:3000) in browser. Please follow [this tutorial](https://shipyard.build/blog/react-wordle-with-docker-compose/) for a complete discussion on building a Docker image for Alterdle.

#### Production

```bash
$> docker build --target=prod -t atlerdle:prod -f docker/Dockerfile .
$> docker run -d -p 80:8080  --name atlerdle-prod atlerdle:prod
```

Open [http://localhost](http://localhost) in browser. See the [entry in the FAQ](#why-does-sharing-of-results-not-work) below about requirements for sharing of results.
