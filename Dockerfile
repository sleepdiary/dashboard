FROM node
WORKDIR /app
CMD [ "sh", "-c", "yarn && yarn serve" ]
