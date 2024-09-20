# SELFIE

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

# Development

```bash
npm install
npm run dev
```

## MongoDB

To use a mongodb server one possible solution is to use a docker container:

Download the mongodb image:
```bash
docker pull bitnami/mongodb:latest
```

Run the mongodb server:
```bash
docker run -p 27017:27017 \
    -e MONGODB_USERNAME="user" \
    -e MONGODB_PASSWORD="password" \
    -e ALLOW_EMPTY_PASSWORD=yes \
    -e MONGODB_DATABASE=tecweb \
        bitnami/mongodb:latest
```

Copy the `.env.example` into `.env` and `.env.local`. The user and the 
password on the previous command have to match with the ones on the 
`.env.local` file. `.env` is used for building.

# Production

```bash
npm run build
```
