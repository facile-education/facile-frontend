#!/bin/bash

PATH_TO_DOCUMENT_LIBRARY=$(grep PATH_TO_DOCUMENT_LIBRARY .env.local | cut -d '=' -f2)

# cd to script directory
cd "$(dirname "$(realpath "$0")")" || exit;

if [[ $2 == "-s" || $2 == "--save" ]];
then
  echo "Saving current document_library to archive..."
  tar -caf "${PATH_TO_DOCUMENT_LIBRARY}/document_library_local.tar.xz" -C "$PATH_TO_DOCUMENT_LIBRARY" document_library
fi

# Delete current doc library
echo "Deleting current document_library..."
rm -Rf "${PATH_TO_DOCUMENT_LIBRARY}document_library"

if [[ $1 ]];
then
  ARCHIVE_TO_LOAD=$1
  echo "Loading archive: $ARCHIVE_TO_LOAD"
else
  ARCHIVE_TO_LOAD=document_library_empty.tar.xz
  echo "No archive specified. Loading default archive: $ARCHIVE_TO_LOAD"
fi

# Décompresser l'archive document_library_empty.tar.xz dans le répertoire contenant la doc library
echo "Extracting archive..."
tar -xaf $ARCHIVE_TO_LOAD -C "$PATH_TO_DOCUMENT_LIBRARY"
