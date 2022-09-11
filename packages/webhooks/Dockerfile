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
ENV TYPE_ROOTS="${APP_DIR}/node_modules/@types,${APP_DIR}/custom-types"

WORKDIR ${APP_DIR}

COPY package*.json ./
COPY tsconfig-container.json ./
# COPY custom-types ./custom-types

RUN npm install --location=global typescript

RUN npm install --save-dev \
  @types/debug \
  @types/google-spreadsheet \
  @types/hapi__hapi \
  @types/hapi__inert \
  @types/hapi__vision \
  @types/node

RUN npm install

COPY src ./src

# this is for troubleshooting TypeScript configuration
# RUN echo "Compiling using TypeScript $(tsc --version): typeRoots is ${TYPE_ROOTS}"
# RUN tsc --project tsconfig-container.json --typeRoots ${TYPE_ROOTS} --showConfig

# this is the actual TypeScript compilation
RUN tsc --project tsconfig-container.json --typeRoots ${TYPE_ROOTS}

# check source code (TS), compiled code (JS), don't show dependencies and types
# https://zaiste.net/posts/tree-ignore-directories-patterns/
# RUN tree -I 'custom-types|node_modules' -a -L 3 ${APP_DIR}

# === STAGE 2 ================================================================ #
FROM node:18.7-bullseye-slim

# Each ARG goes out of scope at the end of the build stage where it was
# defined. That's why we have to repeat it here in this stage.
ARG APP_NAME

# RUN apt-get update && apt-get install --quiet --assume-yes sudo \
#   lsb-release \
#   tree

ENV APP_GROUP=webhooks-group \
    APP_USER=webhooks-user \
    APP_PORT=8080 \
    BUILDER_APP_DIR=/usr/src/app

# add a non-privileged user
RUN groupadd --system ${APP_GROUP} && \
    useradd --system --gid ${APP_GROUP} --create-home ${APP_USER} --comment "container user account" && \
    mkdir -p /home/${APP_USER}/${APP_NAME}

WORKDIR /home/${APP_USER}/${APP_NAME}

# open a non-privileged port for the app to listen to
EXPOSE ${APP_PORT}

COPY --from=builder ${BUILDER_APP_DIR}/package.json ./
COPY --from=builder ${BUILDER_APP_DIR}/node_modules ./node_modules
COPY --from=builder ${BUILDER_APP_DIR}/dist ./dist

RUN chown -R ${APP_USER} ./

# Run everything AFTER as non-privileged user.
USER ${APP_USER}

# check source code and installed dependencies
# RUN tree -a -L 3 .
# check permissions
# RUN ls -1la

# I like to keep this line for troubleshooting
# RUN echo "App ${APP_NAME} will be run by user $(whoami) on $(lsb_release -i -s) $(lsb_release -r -s) and will listen on port ${APP_PORT}"

ENTRYPOINT ["node", "dist/main.js"]
