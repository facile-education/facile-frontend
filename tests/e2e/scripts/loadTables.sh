#!/bin/bash

DOCKER_NAME=$(grep DOCKER_NAME .env.local | cut -d '=' -f2)
VM_USER=$(grep VM_USER .env.local | cut -d '=' -f2)
VM_IP=$(grep VM_IP .env.local | cut -d '=' -f2)
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
  echo "DOCKER_NAME = $DOCKER_NAME"
  echo "DB_USER = $DB_USER"
  echo "DB_PWD = $DB_PWD"
  echo "DB_NAME = $DB_NAME"
  echo "DUMP_NAME = $DUMP_NAME"
  exit 1;
else
  # cd to script directory
  cd "$(dirname "$(realpath "$0")")" || exit;

  # Test if we have to connect to a remote device
  if [[ $VM_USER || $VM_IP ]];
  then
    echo "VM_USER = $VM_USER"
    echo "VM_IP = $VM_IP"


    echo "Copy dump to virtual machine"
    scp $DUMP_NAME $VM_USER@$VM_IP:/home/$VM_USER

    echo "SSH as $VM_USER to reset tables."
    ssh $VM_USER@$VM_IP << EOF
    mariadb -u $DB_USER -p$DB_PWD $DB_NAME < $DUMP_NAME
    rm $DUMP_NAME
EOF
    echo "SSH done."
  else
    if [[ $DOCKER_NAME ]];
    then
      echo "Run mariadb through docker"
      docker exec -i $DOCKER_NAME mariadb -u $DB_USER -p$DB_PWD $DB_NAME < $DUMP_NAME
      echo "Tables loaded."
    else
      mariadb -u $DB_USER -p$DB_PWD $DB_NAME < $DUMP_NAME
      echo "Tables loaded."
    fi
  fi
fi
