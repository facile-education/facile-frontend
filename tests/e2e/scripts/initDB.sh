#!/bin/bash

# Virtual machine infos
VM_USER=$(grep VM_USER .env.local | cut -d '=' -f2)
VM_IP=$(grep VM_IP .env.local | cut -d '=' -f2)

# Docker infos
DOCKER_NAME=$(grep DOCKER_NAME .env.local | cut -d '=' -f2)

# Database infos
DB_USER=$(grep DB_USER .env.local | cut -d '=' -f2)
DB_PWD=$(grep DB_PWD .env.local | cut -d '=' -f2)
DB_NAME=$(grep DB_NAME .env.local | cut -d '=' -f2)

DUMP_NAME=tables/dump_cypress_db.sql
BACKUP_NAME=dev_db_backup.sql

# cd to script directory
cd "$(dirname "$(realpath "$0")")" || exit;

if [[ -z $DB_USER || -z $DB_PWD || -z $DB_NAME || -z $DUMP_NAME ]];
then
  echo "One or more variables are undefined"
  echo "DB_USER = $DB_USER"
  echo "DB_PWD = $DB_PWD"
  echo "DB_NAME = $DB_NAME"
  echo "DUMP_NAME = $DUMP_NAME"
elif [[ $VM_USER || $VM_IP ]];
then
  echo "Copy dump to virtual machine"
  scp $DUMP_NAME $VM_USER@$VM_IP:/home/$VM_USER

  # Warning : Indentation breaks EOF syntax
  echo "SSH as $VM_USER to backup original DB and load the test one."
  ssh $VM_USER@$VM_IP << EOF
mysqldump -u $DB_USER -p$DB_PWD $DB_NAME > $BACKUP_NAME
mariadb -u $DB_USER -p$DB_PWD $DB_NAME < $DUMP_NAME
rm $DUMP_NAME
EOF
  echo "SSH done."
elif [[ $DOCKER_NAME ]];
then
  echo "Run mariadb through docker."
  docker exec -i $DOCKER_NAME mysqldump -u $DB_USER -p$DB_PWD $DB_NAME > $BACKUP_NAME &&
  echo "Backup done." &&
  docker exec -i $DOCKER_NAME mariadb -u $DB_USER -p$DB_PWD $DB_NAME < $DUMP_NAME &&
  echo "Cypress database loaded."
else
  echo "Run mariadb locally." &&
  mysqldump -u $DB_USER -p$DB_PWD $DB_NAME > $BACKUP_NAME &&
  echo "Backup done." &&
  mariadb -u $DB_USER -p$DB_PWD $DB_NAME < $DUMP_NAME &&
  echo "Cypress database loaded."
fi
