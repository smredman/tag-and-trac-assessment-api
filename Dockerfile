FROM node:16-alpine as prod

ENV APPDIR=/usr/src/app
WORKDIR ${APPDIR}

# change files to root group
RUN chgrp -R 0 ${APPDIR} && \
    chmod -R g=u ${APPDIR}

COPY ./node_modules ./node_modules

# copy compiled app into the container
COPY ./dist ./

# remove unnecessary utilities for security
RUN rm -f /usr/bin/wget;
RUN rm -f /usr/bin/nc;
RUN rm -f /usr/bin/nl;
RUN rm -f /sbin/apk;

# change to a non-root user
USER 1001

CMD ["node", "index.js"]