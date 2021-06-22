FROM node
RUN yarn global add @vue/cli
WORKDIR /app
CMD yarn serve
