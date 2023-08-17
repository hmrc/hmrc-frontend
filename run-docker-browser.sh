#!/bin/bash

#######################################
# The script starts a chrome docker container for running Browser tests on a developer machine only.
# The container directs TCP requests from the container to the host machine enabling testing services running via Service Manager.
# WARNING: Do not use this script in the Jenkins Continuous Integration environment
#
# Accepted Environment Variables:
# PORT_MAPPINGS: List of the ports of the services under test.
# TARGET_IP: IP of the host machine. For Mac this is 'host.docker.internal'. For linux this is 'localhost'
#
# NOTE:
# When using on a Linux OS, add "--net=host" to the docker run command.
#######################################

BROWSER="artefacts.tax.service.gov.uk/chrome-with-rinetd:latest"

docker pull ${BROWSER} \
    && docker rm -f chrome \
    && docker run \
        -d \
        --rm \
        --name "chrome" \
        --shm-size=2g \
        -p 4444:4444 \
        -p 5900:5900 \
        -e PORT_MAPPINGS="8888->8888" \
        -e TARGET_IP='host.docker.internal' \
        -e SE_OPTS="--enable-managed-downloads true" \
        -e SE_NODE_GRID_URL="http://localhost:4444" \
        ${BROWSER}
