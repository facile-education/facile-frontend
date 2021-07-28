#!/bin/bash

VM_USER=$(grep VM_USER .env.local | cut -d '=' -f2)
VM_IP=$(grep VM_IP .env.local | cut -d '=' -f2)
DB_USER=$(grep DB_USER .env.local | cut -d '=' -f2)
DB_PWD=$(grep DB_PWD .env.local | cut -d '=' -f2)
DB_NAME=$(grep DB_NAME .env.local | cut -d '=' -f2)

DUMP_NAME=dump_cypress_db.sql

if [[ -z $VM_USER || -z $VM_IP || -z $DB_USER || -z $DB_PWD || -z $DB_NAME || -z $DUMP_NAME ]];
then
  echo "One or more variables are undefined"
  echo "VM_USER = $VM_USER"
  echo "VM_IP = $VM_IP"
  echo "DB_USER = $DB_USER"
  echo "DB_PWD = $DB_PWD"
  echo "DB_NAME = $DB_NAME"
  echo "DUMP_NAME = $DUMP_NAME"
else
  # cd to script directory
  cd "$(dirname "$(realpath "$0")")";

  echo "Copy dump to virtual machine"
  scp $DUMP_NAME $VM_USER@$VM_IP:/home/$VM_USER

  # Warning : Indentation breaks EOF syntax
  echo "SSH as $VM_USER to backup original DB and load the test one."
  ssh $VM_USER@$VM_IP << EOF
mysqldump -u $DB_USER -p$DB_PWD $DB_NAME > dev_db_backup.sql
mysql -u $DB_USER -p$DB_PWD $DB_NAME < $DUMP_NAME
rm $DUMP_NAME
EOF
  echo "SSH done."
fi
