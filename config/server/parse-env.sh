#!/bin/bash
file="./.env"
command="dokku config:set $1"
while IFS= read -r line
do
  command+=" $line"
  printf '%s\n' "$command"
done <"$file"