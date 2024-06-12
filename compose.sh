#!/usr/bin/env bash

help(){
	echo "Usage : compose.sh -u <expo_username> -p <expo_password> "
}

while getopts u:p: opt
do
        case $opt in
                u) 
                    username=$OPTARG
                    ;;
                p) 
                    password=$OPTARG
                    ;;
                ?)
                    help;
                    exit 1;
        esac
done

if [ -z "$username" ] || [ -z "$password" ]; then
        echo 'Missing -u or -p' >&2
        help >&2
        exit 1
fi

# export device IP
echo "REACT_NATIVE_PACKAGER_HOSTNAME=$(ipconfig getifaddr en0)" > .env

# export username & password
echo "EXPO_USERNAME=$username" >> .env
echo "EXPO_PASSWORD=$password" >> .env

# launch service
docker compose up --force-recreate