#!/bin/bash
openssl aes-256-cbc -K $encrypted_2a03bfc35e23_key -iv $encrypted_2a03bfc35e23_iv -in .travis/dokku-deploy.key.enc -out .travis/dokku-deploy.key -d
eval "$(ssh-agent -s)";
chmod 600 .travis/dokku-deploy.key;
ssh-add .travis/dokku-deploy.key;
ssh-keyscan "$DOKKU_HOST" >> ~/.ssh/known_hosts;
git remote add deploy dokku@"$DOKKU_HOST":"$DOKKU_APP";
git config --global push.default simple;
git fetch --unshallow;
git push deploy master --force;