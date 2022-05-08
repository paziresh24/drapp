#!/bin/bash

rm -rf ./env-config.js
touch ./env-config.js

echo "window._env_ = {" >> ./env-config.js

while read -r line || [[ -n "$line" ]];
do
    if printf '%s\n' "$line" | grep -q -e '=' && printf '%s\n' "$line" | grep -q -e '^P24'; then
      name=$(printf '%s\n' "$line" | sed -e 's/=.*//')
      value=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')

      if [[ -f ".env.local" ]]; then
        if grep -q -e "^$name=" ".env.local"; then
             value=$(grep -e "^$name=" ".env.local" | sed -e 's/^[^=]*=//')
        fi
      fi

      if printf '%s\n' "$value" | grep -q -e 'true' ||printf '%s\n' "$value" | grep -q -e 'false'  ; then
        echo "    $name: $value," >> ./env-config.js
      else
        echo "    $name: \`$value\`," >> ./env-config.js
      fi
    fi
done < .env

echo "};" >> ./env-config.js