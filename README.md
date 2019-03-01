
# Time app Backend

Esta aplicación es la encarga de hacer las solicitudes a los servicios de Darksky, donde se recuperan datos sobre las ciudad. Entre esos datos: la hora, temperatura, latitud y longitud. Para luego guardalos en el Redis.

### Prerequisitos:

Tener instalado previamente Redis, y exponerlo en el puerto 6379.

Node v8

npm 5.6.0 ó yarn 1.6.0

### Comandos:

Para levantar la aplicación en local:

    yarn install && yarn start

Para levantarla con Docker:

    docker build -t time-app-backend .

    docker run -d -p=3001:3001 --name container-time-app-backend time-app-backend

La aplicación se expone en el puerto 3001.

### Variables de entorno

    PORT : define el puerto de la aplicación
    APIKEY: define la apikey de darksky
    REDIS_URL: define la uri de redis.
