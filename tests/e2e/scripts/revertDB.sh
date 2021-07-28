#!/bin/bash

VM_USER=$(grep VM_USER .env.local | cut -d '=' -f2)
VM_IP=$(grep VM_IP .env.local | cut -d '=' -f2)
DB_USER=$(grep DB_USER .env.local | cut -d '=' -f2)
DB_PWD=$(grep DB_PWD .env.local | cut -d '=' -f2)
DB_NAME=$(grep DB_NAME .env.local | cut -d '=' -f2)

if [[ -z $VM_USER || -z $VM_IP || -z $DB_USER || -z $DB_PWD || -z $DB_NAME ]];
then
  echo "One or more variables are undefined"
  echo "VM_USER = $VM_USER"
  echo "VM_IP = $VM_IP"
  echo "DB_USER = $DB_USER"
  echo "DB_PWD = $DB_PWD"
  echo "DB_NAME = $DB_NAME"
else
  echo "SSH as $VM_USER to revert to original database."
  ssh $VM_USER@$VM_IP << EOF
mysql -u $DB_USER -p$DB_PWD $DB_NAME < dev_db_backup.sql
EOF
    # rm dev_db_backup.sql
  echo "SSH done."
fi