# Workday's Content Cloud Reference Application

This Node.js application is a reference implementation for Content
Providers.  It is also used to validate the Content Cloud injestor
API specification.

# Getting Starting

For running on host machine, install:
- [Node.js v8.x](https://nodejs.org/en/)

If using Docker runtime on host machine, install:
- [Docker CE](https://www.docker.com/community-edition)

# Running on host machine

The following steps will have you up and running on your host
machine:

```bash
git clone XXX
cd wday-cc-refapp
npm install
npm start
```

# Running on docker

The following steps will build and run the docker container on your
host machine:

```bash
git clone XXX
cd wday-cc-refapp
docker build -t wday-cc-refapp .
docker run -p 8080:8080 -d wday-cc-refapp
```

# Explore the API

After running the above, it should say the following:

```
Web server listening at: http://localhost:8080
Browse your REST API at http://localhost:8080/explorer
```

In a browser navigate to `http://localhost:8080/explorer`.

If you're running in docker, network host may vary.  To find the IP
address of your docker machine use from a shell:

```
docker-machine ip
```

And use that address instead of localhost.  For example,
`http://192.168.99.100/explorer`

The Swagger UI let's you explorer and try out the REST API.  You may
also use any HTTP client like PostMan to call the REST API directly.

# Seeding the data

The in-memory DB read from the file `mockdb.json` starts with 1000
records.  You may use the `POST` endpoint to seed the database with
test cases.  Note, the `POST` endpoint is **ONLY** for test purposes
of this reference application and not a supported API in the specification.

You may also re-generate a new dataset by running the cmd:

```
npm run populate_db
```

We've distributed a db with lots of bad test cases. To load this mis-behaving
db set the env var `NODE_ENV` to `bad`, e.g.,

```
export NODE_ENV=bad
```

# Authentication

While the `POST` API is unprotected, the `GET` endpoint will require
a valid JWT.

A valid token is generated on startup of the server and is output
to the console for use in the Explorer (Swagger UI) or another tool.

The token may be supplied in `access_token=Bearer <token>` query string
OR as an `Authorization: Bearer <token>` HTTP header.

# Re-keying

`OpenSSL` is required to re-key the reference application.

Private and public RSA keys (self-signed) are provided with this
source code.  If you would like to regenerate the keys use:
```
./server/scripts/keygen.sh
```

You'll be prompted for X509 attributes, but you can ignore them all and
just use the defaults.  On next restart of the reference application,
a new sample token will be generated using the new private key.

Note: these default are NOT real keys used by Content Cloud but have
the same properties, e.g., RSA 2048.

# Testing

You may use the validator tool to test this reference application
conformance to the specification.  Use the included mocha tests by running:

```
npm test
```

