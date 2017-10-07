FROM node:latest

MAINTAINER RCGCoder <ricardo.cantabran@gmail.com>

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update 
#RUN apt-get upgrade -y
RUN apt-get install curl wget android-tools-adb android-tools-fastboot mc -y

WORKDIR /tmp
RUN wget http://security.ubuntu.com/ubuntu/pool/universe/k/kodi/kodi-eventclients-common_15.2+dfsg1-3ubuntu1.1_all.deb
RUN wget http://security.ubuntu.com/ubuntu/pool/universe/k/kodi/kodi-eventclients-kodi-send_15.2+dfsg1-3ubuntu1_all.deb 
RUN dpkg -i *.deb
RUN rm *.deb

