#!/bin/bash

declare -a languages=("fr" "en" "it" "de")

locale_folder="src/locales"

# Check if 'locales' folder exist
if [ ! -d "$locale_folder" ]; then
  echo "Folder $locale_folder does not exist."
  exit 1
fi

# /!\ The file must end with a new line to count the last translation key
function count_translation_key_in_file {
  local file="$1"
  local nb_key=0

  # Counting the lines containing at least 3 characters
  while IFS= read -r ligne; do
    if [ ${#ligne} -ge 3 ]; then
      ((nb_key++))
    fi
  done < "$file"

  echo "$nb_key"
}

function count_lang_key {
  local folder="$1"
  local lang="$2"
  local file="${lang}.json"

  if [ -f "$folder/$file" ]; then
    count_translation_key_in_file "$folder/$file"
  else
    echo "0"
  fi
}

different_keys=false
first_lang_nb_key=0

# Check line number in translation files
for language in "${languages[@]}"; do
  current_lang_nb_key=$(count_lang_key "$locale_folder" "$language")
  echo "$current_lang_nb_key translation key for language $language"

  # Check if there if differences between lang
  if [ "$first_lang_nb_key" -eq 0 ]; then
    first_lang_nb_key=$current_lang_nb_key
  elif [ "$current_lang_nb_key" -ne "$first_lang_nb_key" ]; then
    different_keys=true
    break
  fi
done
if [ "$different_keys" = true ]; then
  echo "The number of translation keys is different for at least one language"
  exit 1
fi
