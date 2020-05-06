#!/bin/bash
eval "$(ssh-agent -s)";
ssh-add $DEPLOY_DOKKU_KEY;
ssh-keyscan "$DOKKU_HOST" >> ~/.ssh/known_hosts;
git remote add deploy dokku@"$DOKKU_HOST":"$DOKKU_APP";
git config --global push.default simple;
git push deploy master;