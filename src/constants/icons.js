// TODO not export all in one time to improve performances
const icons = {
  file: require('@assets/documentIcons/icon_fichier_neutre.svg').default,
  folder: require('@assets/documentIcons/icon_dossier_neutre.svg').default,
  folderOpen: require('@assets/documentIcons/icon_dossier_neutre.svg').default,
  extensions: {
    ggb: require('@assets/documentIcons/geogebra.png').default,
    gif: 'file-image',
    html: 'code',
    jpg: 'file-image',
    jpeg: 'file-image',
    mind: require('@assets/documentIcons/mind-map.png').default,
    mp3: 'music',
    mp4: 'film',
    mpg: 'film',
    odt: require('@assets/documentIcons/doc.png').default,
    pdf: require('@assets/documentIcons/pdf.png').default,
    png: 'file-image',
    sb3: require('@assets/documentIcons/scratch.png').default, // scratch
    wav: 'music',
    zip: 'file-archive'
  },
  options: {
    addToFavorites: 'star',
    download: require('@/assets/options/icon_download.svg').default,
    delete: require('@/assets/options/icon_trash.svg').default,
    delete_white: require('@/assets/options/icon_trash_white.svg').default,
    deleteDefinitely: ['far', 'trash-alt'],
    duplicate: require('@/assets/options/icon_duplicate.svg').default,
    import: require('@assets/options/icon_fichier_ajout.svg').default,
    forward: require('@/assets/options/icon_share.svg').default,
    forward_white: require('@/assets/options/icon_share_white.svg').default,
    leave: require('@/assets/options/icon_leave.svg').default,
    markAsRead: require('@/assets/options/icon_mark_as_read.svg').default,
    markAsRead_white: require('@/assets/options/icon_mark_as_read_white.svg').default,
    move: require('@/assets/options/icon_move.svg').default,
    modify: require('@/assets/options/icon_edit_texte.svg').default,
    modify_white: require('@/assets/options/icon_edit_texte_white.svg').default,
    new: require('@assets/options/icon_add.svg').default,
    newFolder: require('@assets/options/icon_dossier_ajout.svg').default,
    paste: require('@/assets/options/icon_duplicate.svg').default,
    share: require('@/assets/options/icon_share.svg').default,
    showData: 'info-circle',
    rename: require('@/assets/options/icon_edit_texte.svg').default,
    refresh: require('@/assets/options/icon_refresh.svg').default,
    reply: require('@/assets/options/icon_answer.svg').default,
    reply_white: require('@/assets/options/icon_answer_white.svg').default,
    replyAll: require('@/assets/options/icon_answer_all.svg').default,
    replyAll_white: require('@/assets/options/icon_answer_all_white.svg').default,
    upload: require('@/assets/options/icon_upload.svg').default
  }
}

export {
  icons
}
