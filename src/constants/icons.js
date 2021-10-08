// TODO not export all in one time to improve performances
const icons = {
  file: 'file',
  folder: require('@/assets/icon_dossier_neutre.svg'),
  folderOpen: require('@/assets/icon_dossier_neutre.svg'),
  extensions: {
    cao: require('@/assets/logo.png'),
    gif: 'file-image',
    html: 'code',
    jpg: 'file-image',
    jpeg: 'file-image',
    mind: require('@/assets/mind-map.png'),
    mp3: 'music',
    mp4: 'film',
    mpg: 'film',
    pdf: require('@/assets/pdf.png'),
    png: 'file-image',
    wav: 'music',
    zip: 'file-archive'
  },
  options: {
    addToFavorites: 'star',
    download: require('@/assets/options/icon_download.svg'),
    deleteDefinitely: ['far', 'trash-alt'],
    duplicate: require('@/assets/options/icon_duplicate.svg'),
    import: require('@/assets/options/icon_fichier_ajout.svg'),
    forward: require('@/assets/options/icon_share.svg'),
    forward_white: require('@/assets/options/icon_share_white.svg'),
    leave: require('@/assets/options/icon_leave.svg'),
    markAsRead: require('@/assets/options/icon_mark_as_read.svg'),
    markAsRead_white: require('@/assets/options/icon_mark_as_read_white.svg'),
    move: require('@/assets/options/icon_move.svg'),
    modify: require('@/assets/options/icon_edit_texte.svg'),
    modify_white: require('@/assets/options/icon_edit_texte_white.svg'),
    newFolder: require('@/assets/options/icon_dossier_ajout.svg'),
    paste: require('@/assets/options/icon_duplicate.svg'),
    share: require('@/assets/options/icon_share.svg'),
    howData: 'info-circle',
    rename: require('@/assets/options/icon_edit_texte.svg'),
    refresh: require('@/assets/options/icon_refresh.svg'),
    reply: require('@/assets/options/icon_answer.svg'),
    reply_white: require('@/assets/options/icon_answer_white.svg'),
    replyAll: require('@/assets/options/icon_answer_all.svg'),
    replyAll_white: require('@/assets/options/icon_answer_all_white.svg'),
    delete: require('@/assets/options/icon_trash.svg'),
    delete_white: require('@/assets/options/icon_trash_white.svg')
  }
}

export {
  icons
}
