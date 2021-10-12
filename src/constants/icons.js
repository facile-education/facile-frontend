// TODO not export all in one time to improve performances
const icons = {
  file: 'file',
  folder: require('@/assets/icon_dossier_neutre.svg').default,
  folderOpen: require('@/assets/icon_dossier_neutre.svg').default,
  extensions: {
    gif: 'file-image',
    html: 'code',
    jpg: 'file-image',
    jpeg: 'file-image',
    mind: require('@/assets/mind-map.png').default,
    mp3: 'music',
    mp4: 'film',
    mpg: 'film',
    pdf: require('@/assets/pdf.png').default,
    png: 'file-image',
    wav: 'music',
    zip: 'file-archive'
  },
  options: {
    addToFavorites: 'star',
    download: require('@/assets/options/icon_download.svg').default,
    deleteDefinitely: ['far', 'trash-alt'],
    duplicate: require('@/assets/options/icon_duplicate.svg').default,
    import: require('@/assets/options/icon_fichier_ajout.svg').default,
    forward: require('@/assets/options/icon_share.svg').default,
    forward_white: require('@/assets/options/icon_share_white.svg').default,
    leave: require('@/assets/options/icon_leave.svg').default,
    markAsRead: require('@/assets/options/icon_mark_as_read.svg').default,
    markAsRead_white: require('@/assets/options/icon_mark_as_read_white.svg').default,
    move: require('@/assets/options/icon_move.svg').default,
    modify: require('@/assets/options/icon_edit_texte.svg').default,
    modify_white: require('@/assets/options/icon_edit_texte_white.svg').default,
    newFolder: require('@/assets/options/icon_dossier_ajout.svg').default,
    paste: require('@/assets/options/icon_duplicate.svg').default,
    share: require('@/assets/options/icon_share.svg').default,
    howData: 'info-circle',
    rename: require('@/assets/options/icon_edit_texte.svg').default,
    refresh: require('@/assets/options/icon_refresh.svg').default,
    reply: require('@/assets/options/icon_answer.svg').default,
    reply_white: require('@/assets/options/icon_answer_white.svg').default,
    replyAll: require('@/assets/options/icon_answer_all.svg').default,
    replyAll_white: require('@/assets/options/icon_answer_all_white.svg').default,
    delete: require('@/assets/options/icon_trash.svg').default,
    delete_white: require('@/assets/options/icon_trash_white.svg')
  }
}

export {
  icons
}
