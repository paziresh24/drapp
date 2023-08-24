#!/bin/bash

rm -rf ./env-config.js
touch ./env-config.js

echo "window._env_ = {" >> ./env-config.js

while IFS= read -r line || [ -n "$line" ];
do
    if printf '%s\n' "$line" | grep -q -e '=' && printf '%s\n' "$line" | grep -q -e '^P24'; then
      varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
      varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')

      value=$(eval "echo \$$varname")
      [ -z "$value" ] && value=${varvalue}

      if [ -f ".env.local" ]; then
        if grep -q -e "$varname" ".env.local"; then
          value=$(grep -e "^$varname=" ".env.local" | sed -e 's/^[^=]*=//')
          varvalue=$(grep -e "^$varname=" ".env.local" | sed -e 's/^[^=]*=//')
        fi
      fi

      if printf '%s\n' "$varvalue" | grep -q -e 'true' || printf '%s\n' "$varvalue" | grep -q -e 'false'; then
        echo "    $varname: $value," >> ./env-config.js
      else
        echo "    $varname: \`$value\`," >> ./env-config.js
      fi
    fi
done < .env

echo "};" >> ./env-config.js
