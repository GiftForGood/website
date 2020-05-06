#!/bin/bash
eval "$(ssh-agent -s)";
chmod 600 ../../.travis/dokku-deploy.key;
ssh-add ../../.travis/dokku-deploy.key;
ssh-keyscan "$DOKKU_HOST" >> ~/.ssh/known_hosts;
git remote add deploy dokku@"$DOKKU_HOST":"$DOKKU_APP";
git config --global push.default simple;
git push deploy master;