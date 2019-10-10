# :: Header
FROM node:10.16.1-alpine

# :: Run
USER root

RUN apk --update --no-cache add shadow npm

# :: Install Websocket
RUN npm install -g websocket

RUN mkdir -p /app
ADD ./source/main.js /app/main.js

# :: docker -u 1000:1000 (no root initiative)
RUN usermod -u 1000 node \
	&& groupmod -g 1000 node \
	&& chown -R node:node /app

# :: Volumes
VOLUME ["/app"]

# :: Start
USER node
CMD ["node", "/app/main.js"]
