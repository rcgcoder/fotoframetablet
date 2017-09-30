FROM johnsandiford/kodi-headless

MAINTAINER RCGCoder <ricardo.cantabran@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

##### Setting up the HS100 needs ...... based on the docker file of arhea/tplink-hs100 container (https://github.com/arhea/tplink-hs100)  #####

# Speed up APT
#RUN echo "force-unsafe-io" > /etc/dpkg/dpkg.cfg.d/02apt-speedup \
#  && echo "Acquire::http {No-Cache=True;};" > /etc/apt/apt.conf.d/no-cache

RUN apt-get update 
RUN apt-get upgrade
RUN apt-get install curl nodejs npm wget adb
RUN mkdir -p /usr/src/app 
RUN mkdir -p /usr/src/app/src
RUN mkdir -p /usr/src/app/src/tplink
RUN mkdir -p /usr/src/app/src/config


WORKDIR /usr/src/app
RUN wget https://raw.githubusercontent.com/RCGCoder/tplink-hs100/master/tplink-hub/package.json
RUN wget https://raw.githubusercontent.com/RCGCoder/tplink-hs100/master/tplink-hub/index.js
RUN npm install

WORKDIR /usr/src/app/src/tplink
RUN wget https://raw.githubusercontent.com/RCGCoder/tplink-hs100/master/tplink-hub/src/tplink/index.js

WORKDIR /usr/src/app/src/config
RUN wget https://raw.githubusercontent.com/RCGCoder/tplink-hs100/master/tplink-hub/src/config/logger.js

#EXPOSE 3000
#We will run one script at the end
#WORKDIR /usr/src/app
#HEALTHCHECK CMD curl --fail http://localhost:3000/health || exit 1
#CMD [ "npm", "start" ] 


