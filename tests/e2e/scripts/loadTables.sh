#!/bin/bash

DB_USER=$(grep DB_USER .env.local | cut -d '=' -f2)
DB_PWD=$(grep DB_PWD .env.local | cut -d '=' -f2)
DB_NAME=$(grep DB_NAME .env.local | cut -d '=' -f2)

if [[ $1 ]];
then
  DUMP_NAME="tables/$1"
  echo "DUMP_NAME: $DUMP_NAME"
else
  DUMP_NAME=dump_cypress_db.sql
fi

if [[ -z $DB_USER || -z $DB_PWD || -z $DB_NAME || -z $DUMP_NAME ]];
then
  echo "One or more variables are undefined"
  echo "DB_USER = $DB_USER"
  echo "DB_PWD = $DB_PWD"
  echo "DB_NAME = $DB_NAME"
  echo "DUMP_NAME = $DUMP_NAME"
else
  # cd to script directory
  cd "$(dirname "$(realpath "$0")")" || exit;
  mysql -u $DB_USER -p$DB_PWD $DB_NAME < $DUMP_NAME
  echo "Tables loaded."
fi
