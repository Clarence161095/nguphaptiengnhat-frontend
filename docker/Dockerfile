FROM node:14 as front_end

WORKDIR /front_end

COPY ./front_end .

RUN npm install

EXPOSE 3033

# CMD [ "npm", "run", "start:prod" ]
CMD [ "npm", "run", "dev" ]
