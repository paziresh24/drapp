#!/bin/bash

rm -rf ./public/env-config.js
touch ./public/env-config.js

echo "window._env_ = {" >> ./public/env-config.js

while read -r line || [[ -n "$line" ]];
do
    if printf '%s\n' "$line" | grep -q -e '=' && printf '%s\n' "$line" | grep -q -e '^P24'; then
      varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
      varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')


      value=$(printf '%s\n' "${!varname}")
      [[ -z $value ]] && value=${varvalue}

       if grep -q -e $varname ".env.local"; then
        value=$(grep -e "^$varname=" ".env.local" | sed -e 's/^[^=]*=//')
        varvalue=$(grep -e "^$varname=" ".env.local" | sed -e 's/^[^=]*=//')
        
      fi

    

      if printf '%s\n' "$varvalue" | grep -q -e 'true' ||printf '%s\n' "$varvalue" | grep -q -e 'false'  ; then
        echo "    $varname: $value," >> ./public/env-config.js
      else
        echo "    $varname: \`$value\`," >> ./public/env-config.js
      fi
    fi

 
done < .env

echo "};" >> ./public/env-config.js