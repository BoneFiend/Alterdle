# Alterdle

This project forks Reactle, a clone of the popular word guessing game we all know and love. Made using React, Typescript, and Tailwind.

[**Try out the demo!**](https://reactle.vercel.app/)

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
$> docker build -t alterdle:dev -f docker/Dockerfile .
$> docker run -d -p 3000:3000 --name atlerdle-dev atlerdle:dev
```

Open [http://localhost:3000](http://localhost:3000) in browser.

#### Production

```bash
$> docker build --target=prod -t atlerdle:prod -f docker/Dockerfile .
$> docker run -d -p 80:8080  --name atlerdle-prod atlerdle:prod
```

Open [http://localhost](http://localhost) in browser. See the [entry in the FAQ](#why-does-sharing-of-results-not-work) below about requirements for sharing of results.
