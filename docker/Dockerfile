FROM node:20.14.12-alpine3.14 AS node_modules
WORKDIR /app
COPY package-lock.json package.json ./
RUN pnpm install
COPY . .

FROM node_modules AS prod_builder
RUN pnpm build

## Production image
FROM nginx:1.25.2-alpine AS prod
COPY docker/etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=prod_builder /app/build /usr/share/nginx/html
COPY docker/build_system.sh .
RUN ./build_system.sh && rm ./build_system.sh
# port use by Nginx within docker network.
EXPOSE 8080
USER alterdle

## Development image
FROM node_modules AS dev
EXPOSE 3000
CMD pnpm start
