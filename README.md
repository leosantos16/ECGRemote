# Projeto de ECG remoto

![](./img/img.png)

Aqui voce encontra o codigo fonte do servidor (back-end) do projeto _ECG remoto_. _ECG remoto_ eh um projeto de pesquisa com apoio do [IFSul](www.ifsul.edu.br)
 
Este servidor esta preparado para receber dados de exames de Eletrocardiograma (ECG) enviados de dispositivos com capacidade de coneccao a internet.
O hardware para realizacao do exame e envio dos dados coletados esta em desenvolvimento.

O servidor esta hospedado em [https://ecgremote.herokuapp.com](https://ecgremote.herokuapp.com/).

A visualizacao dos dados do servidor esta disponivel no nosso front-end 
O front-end esta em [http://tsi.charqueadas.ifsul.edu.br/~ecgremoto/](http://tsi.charqueadas.ifsul.edu.br/~ecgremoto/) - versao em desenvolvimento

## Preliminares


Voce tem 2 formas de utilizar o servidor deste repositorio
 1. **Full Local** - Configurando todo o ambiente em sua maquina local. Nesta opcao voce vai precisar instalar todas as ferramentas e fazer o download deste repositorio. 
 2. **Docker Version** - Montando o ambiente pronto e sem fazer download. Nesta opcao voce so precisa instalar o Docker e montar a imagem do ambiente pronto diretamente da nuvem, sem fazer download.

## Requisitos
#### Full Local 
- NodeJS [https://nodejs.org/en/](https://nodejs.org/en/)
- MongoDB [https://www.mongodb.com/](https://www.mongodb.com/)
- Python 3.x [https://www.python.org/downloads/](https://www.python.org/downloads/)
- yarn [https://yarnpkg.com/package/download](https://yarnpkg.com/package/download)
- Biblioteca Python biosppy [https://biosppy.readthedocs.io/en/stable/](https://biosppy.readthedocs.io/en/stable/)
- Aplicação ECG Remoto (este repositório)

#### Docker Version
- Docker e Docker Compose [https://docs.docker.com/](https://docs.docker.com/)

#### Heroku CLI
- Heroku CLI [https://devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)


## Instalação
#### Full Local 
1. Faca download deste repositorio
```sh
git clone https://github.com/MarceloSkank/ECGRemote .
```
2. Instale o pacote yarn do NodeJS 
```sh
npm install --global yarn
cd EcgRemote/
yarn install
```
3. Instale o BiosSPy e outras bibliotecas nescessarias por meio do pip 
```sh
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py
pip install biosspy
pip install certifi
pip install request
pip install pymongo[srv]
pip install python-dotenv
```
4. Verifique a instalacao do BiosSPy
```sh
cd python_src
python test.py
```

## Utilizacao
Apos o set-up do ambiente escolhido, voce precisa destes comandos para executar
#### Full Local 
No diretorio `ECGRemote` execute:
```sh
yarn dev
```
Visualize o servidor rodando no navegador:
```sh
http://localhost:${SERVER_PORT}/
```

#### Docker Version
Utilize o comando abaixo para montar e rodar a API ECG Remoto e o Banco de Dados MongoDB. 
```sh
sudo docker-compose up -d
```
O script do Docker Compose monta uma imagem para o MongoDB e uma imagem para a API ECG Remoto. A imagem do MongoDB vem diretamente do repositorio publico [Docker Hub](https://hub.docker.com/_/mongo). Ja a imagem sera construida localmente seguindo as instrucoes do `Dockerfile` deste repo. Em seguida, dois containers sao instaciados a partir das imagens.

1. Verifique se ***DB_ECG*** e ***CLOUD_ECG*** estao na lista de containers e se estao executando
```sh
sudo docker ps -a
```
Coluna *STATUS* da figura esta em **Up** quando o container esta executando. *STATUS* **Exited** indica o container parado. 

2. Caso ***DB_ECG*** ou ***CLOUD_ECG***  estejam parados, ou seja, na lista de containers com status **Exited**, voce pode inicializa-los:
```sh
sudo docker container start NOME_CONTAINER
```
Caso ***DB_ECG*** ou ***CLOUD_ECG***  estejam executando, ou seja, na lista de containers com status **UP**, voce pode inicializa-los:
```sh
sudo docker container stop NOME_CONTAINER
```
3. Voce pode remover toda a instalacao com o comando:
```sh
docker-compose down
```


#### Utilização
1. Com ambos os containeres executando (status **Up**), verifique se voce consegue acessar:
```sh
# API ECG remoto
curl http://localhost:${SERVER_PORT}/`
# Mongo DB
curl http://localhost:27017/ 
```
2. Em caso de problemas, verifique os logs:
```sh
docker-compose logs -f
```

## Rotas
| Rota               | Metodo | Descricao                                                                                                  |
|--------------------|--------|------------------------------------------------------------------------------------------------------------|
| `/save_exam`       | POST   | Salva os exames no formato `{sampling_rate": 360,"resolution": 145,"labels": ["ECG"],"data": [968,870,1110,4567],	"userId": "Fulano de tal",	"title": "Ola",type": "1 NSR"}`
| `/:user/exams/:id/remove` |DELETE| Remove o Exame pelo ID
|`/:user/exams/update/:id`| GET | Faz um Update do exame pelo ID (utilizado para acresentar mais dados de ecg) exemplo: http://ecgremoto.herokuapp.com/{nome}/exams/update/{id}?data=1234 
|`/list_all`        | GET   | Lista todos os exames
|`/:user/exams/:id` | GET | Acessa o exame Pelo ID|
|`/update_exam/:id` |POST| Faz a mesma coisa que a rota `/:user/exams/update/:id`, porem é ustilizada com o metodo POST (utilizado para acresentar mais dados de ecg), exemplo: {"data":[1111, 952, 988]}. 

### Comunicação entre Servidor <-> Hardware

#### Heroku CLI
Para fazer Deploy do seu container no Heroku.

1. Faça Login na sua conta heroku
```sh
heroku login
```

2. Faça Login também no cnotainer Heroku.
```sh
heroku container:login
```

3. Crie uma aplicação e escolha o nome ***name_app***
```sh
heroku create name_app
```

4. Contrua um conteinaer utilizando o docker no resgistro do heroku e de um *push*.
```sh
docker build -t registry.heroku.com/name_app/web 
docker push registry.heroku.com/name_app/web
```

4. usando o herou e um release no seu app e depois abra.
```sh
heroku container:release web -a name_app
heroku open -a name_app
```
