FROM node:latest

MAINTAINER RCGCoder <ricardo.cantabran@gmail.com>

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update 
#RUN apt-get upgrade -y
RUN apt-get install curl wget android-tools-adb android-tools-fastboot mc -y

