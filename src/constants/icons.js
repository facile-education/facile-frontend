// TODO not export all in one time to improve performances
const icons = {
  file: require('@assets/documentIcons/icon_fichier_neutre.svg'),
  folder: require('@assets/documentIcons/icon_dossier_neutre.svg'),
  folderOpen: require('@assets/documentIcons/icon_dossier_neutre.svg'),
  extensions: {
    ggb: require('@assets/documentIcons/geogebra.png'),
    gif: 'file-image',
    html: require('@assets/documentIcons/wisiwig.svg'),
    jpg: 'file-image',
    jpeg: 'file-image',
    mind: require('@assets/documentIcons/mind-map.png'),
    mp3: require('@assets/documentIcons/audio.svg'),
    mp4: 'film',
    mpg: 'film',
    mov: 'film',
    odp: require('@assets/documentIcons/doc.png'),
    ods: require('@assets/documentIcons/doc.png'),
    odt: require('@assets/documentIcons/doc.png'),
    pdf: require('@assets/documentIcons/pdf.png'),
    png: 'file-image',
    sb3: require('@assets/documentIcons/scratch.png'), // scratch
    wav: 'music',
    zip: 'file-archive'
  },
  options: {
    addToFavorites: 'star',
    copyWebdavUrl: require('@/assets/options/icon_webdav.png'),
    download: require('@/assets/options/icon_download.svg'),
    delete: require('@/assets/options/icon_trash.svg'),
    delete_white: require('@/assets/options/icon_trash_white.svg'),
    deleteDefinitely: ['far', 'trash-alt'],
    details: require('@/assets/options/icon_details.svg'),
    duplicate: require('@/assets/options/icon_duplicate.svg'),
    import: require('@assets/options/icon_fichier_ajout.svg'),
    forward: require('@/assets/options/icon_share.svg'),
    forward_white: require('@/assets/options/icon_share_white.svg'),
    leave: require('@/assets/options/icon_leave.svg'),
    markAsRead: require('@/assets/options/icon_mark_as_read.svg'),
    markAsRead_white: require('@/assets/options/icon_mark_as_read_white.svg'),
    move: require('@/assets/options/icon_move.svg'),
    modify: require('@/assets/options/icon_edit_texte.svg'),
    modify_white: require('@/assets/options/icon_edit_texte_white.svg'),
    new: require('@assets/options/icon_add.svg'),
    newFolder: require('@assets/options/icon_dossier_ajout.svg'),
    paste: require('@/assets/options/icon_duplicate.svg'),
    share: require('@/assets/options/icon_share.svg'),
    rename: require('@/assets/options/icon_edit_texte.svg'),
    refresh: require('@/assets/options/icon_refresh.svg'),
    reply: require('@/assets/options/icon_answer.svg'),
    reply_white: require('@/assets/options/icon_answer_white.svg'),
    replyAll: require('@/assets/options/icon_answer_all.svg'),
    replyAll_white: require('@/assets/options/icon_answer_all_white.svg'),
    upload: require('@/assets/options/icon_upload.svg')
  }
}

export {
  icons
}
