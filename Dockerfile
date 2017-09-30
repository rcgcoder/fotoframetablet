FROM johnsandiford/kodi-headless:latest

MAINTAINER RCGCoder <ricardo.cantabran@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update 
RUN apt-get upgrade
RUN apt-get install curl nodejs npm wget adb
RUN mkdir -p /usr/src/app 
RUN mkdir -p /usr/src/app/src
RUN mkdir -p /usr/src/app/src/tplink
RUN mkdir -p /usr/src/app/src/config

