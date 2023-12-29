#!/bin/bash

PATH_TO_DOCUMENT_LIBRARY=$(grep PATH_TO_DOCUMENT_LIBRARY .env.local | cut -d '=' -f2)

# cd to script directory
cd "$(dirname "$(realpath "$0")")" || exit 1;

if [[ -z $PATH_TO_DOCUMENT_LIBRARY ]];
then
  echo "PATH_TO_DOCUMENT_LIBRARY variable is undefined in .env.local file"
  exit 1
else
  if [[ $2 == "-s" || $2 == "--save" ]];
  then
    echo "Saving current document_library to archive..."
    tar -caf "${PATH_TO_DOCUMENT_LIBRARY}/document_library_local.tar.xz" -C "$PATH_TO_DOCUMENT_LIBRARY" document_library
  fi

  # Delete current doc library
  echo "Deleting current document_library..."
  rm -r "${PATH_TO_DOCUMENT_LIBRARY}/document_library"

  if [[ $1 ]];
  then
    ARCHIVE_TO_LOAD="documentLibrary/$1"
    echo "Loading archive: $ARCHIVE_TO_LOAD"
  else
    ARCHIVE_TO_LOAD=documentLibrary/document_library_empty.tar.xz
    echo "No archive specified. Loading default archive: $ARCHIVE_TO_LOAD"
  fi

  # Extract document_library_empty.tar.xz in the folder containing the document library
  echo "Extracting archive..."
  tar -xaf $ARCHIVE_TO_LOAD -C "$PATH_TO_DOCUMENT_LIBRARY"
fi
