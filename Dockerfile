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

