FROM node:latest
RUN mkdir /app

LABEL AUTHOR="Cássio Ribeiro <cassioribeiropereira@gmail.com>"
LABEL MAINTAINER="André Luís Del Mestre Martins <andremartins@ifsul.edu.br>"
LABEL ADVISOR="André Luís Del Mestre Martins <andremartins@ifsul.edu.br>"

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

ENV DB_URI=mongodb+srv://tcc:tccSenha@cluster0.tx7an.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
ENV SERVER_PORT=3000

CMD ["npm", "start"]