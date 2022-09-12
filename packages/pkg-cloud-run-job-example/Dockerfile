# === STAGE 1 ================================================================ #
FROM node:18.7-bullseye AS builder

LABEL maintainer="giacomo@giacomodebidda.com"

# An ARG instruction goes out of scope at the end of the build stage where it
# was defined.
# To use an arg in multiple stages, EACH STAGE must include the ARG instruction.
# https://docs.docker.com/engine/reference/builder/#scope
ARG APP_NAME
RUN if [ -z "${APP_NAME}" ] ; then echo "The APP_NAME argument is missing!" ; exit 1; fi

# RUN apt-get update && apt-get install --quiet --assume-yes sudo \
#   lsb-release \
#   tree

ENV APP_DIR=/usr/src/app

WORKDIR ${APP_DIR}

COPY package*.json ./

RUN npm install --location=global pkg

RUN npm install

COPY src ./src

RUN pkg -t node16-linux-x64 src/index.js && \
  mkdir dist && \
  mv index dist/executable

# RUN tree -I 'node_modules' -a -L 3 ${APP_DIR}

# === STAGE 2 ================================================================ #
FROM node:18.7-bullseye-slim

# Each ARG goes out of scope at the end of the build stage where it was
# defined. That's why we have to repeat it here in this stage.
ARG APP_NAME

# RUN apt-get update && apt-get install --quiet --assume-yes sudo \
#   lsb-release \
#   tree

ENV APP_GROUP=dk-group \
    APP_USER=dk-user \
    BUILDER_APP_DIR=/usr/src/app

# add a non-privileged user
RUN groupadd --system ${APP_GROUP} && \
    useradd --system --gid ${APP_GROUP} --create-home ${APP_USER} --comment "container user account" && \
    mkdir -p /home/${APP_USER}/${APP_NAME}

WORKDIR /home/${APP_USER}/${APP_NAME}

COPY --from=builder ${BUILDER_APP_DIR}/dist/executable ./executable

RUN chown -R ${APP_USER} ./

# Run everything AFTER as non-privileged user.
USER ${APP_USER}

# check source code and installed dependencies
# RUN tree -a -L 3 .
# check permissions
# RUN ls -1la

# I like to keep this line for troubleshooting
# RUN echo "App ${APP_NAME} will be run by user $(whoami) on $(lsb_release -i -s) $(lsb_release -r -s)"

ENTRYPOINT ["./executable"]
