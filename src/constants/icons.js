// TODO not export all in one time to improve performances
const icons = {
  file: require('@assets/icons/documents/icon-file.svg'),
  folder: require('@assets/icons/documents/icon-folder.svg'),
  folderOpen: require('@assets/icons/documents/icon-folder.svg'),
  extensions: {
    ggb: require('@assets/icons/documents/geogebra.svg'),
    gif: require('@assets/icons/documents/image.svg'),
    html: require('@assets/icons/documents/wisiwig.svg'),
    jpg: require('@assets/icons/documents/image.svg'),
    jpeg: require('@assets/icons/documents/image.svg'),
    mind: require('@assets/icons/documents/mind-map.svg'),
    mp3: require('@assets/icons/documents/audio.svg'),
    mp4: require('@assets/icons/documents/video.svg'),
    mpg: require('@assets/icons/documents/video.svg'),
    mov: require('@assets/icons/documents/video.svg'),
    odp: require('@assets/icons/documents/odp.svg'),
    ppt: require('@assets/icons/documents/odp.svg'),
    sxi: require('@assets/icons/documents/odp.svg'),
    pptx: require('@assets/icons/documents/odp.svg'),
    csv: require('@assets/icons/documents/ods.svg'),
    ods: require('@assets/icons/documents/ods.svg'),
    sxc: require('@assets/icons/documents/ods.svg'),
    tsv: require('@assets/icons/documents/ods.svg'),
    xls: require('@assets/icons/documents/ods.svg'),
    xlsx: require('@assets/icons/documents/ods.svg'),
    odt: require('@assets/icons/documents/odt.svg'),
    doc: require('@assets/icons/documents/odt.svg'),
    sxw: require('@assets/icons/documents/odt.svg'),
    docx: require('@assets/icons/documents/odt.svg'),
    pdf: require('@assets/icons/documents/pdf.svg'),
    png: require('@assets/icons/documents/image.svg'),
    sb3: require('@assets/icons/documents/scratch.svg'),
    wav: 'music',
    zip: 'file-archive'
  },
  options: {
    addToFavorites: 'star',
    copyWebdavUrl: require('@/assets/options/icon_webdav.svg'),
    copyUrl: require('@/assets/options/icon_duplicate.svg'),
    download: require('@/assets/options/icon_download.svg'),
    delete: require('@/assets/icons/trash.svg'),
    deleteDefinitely: ['far', 'trash-alt'],
    details: require('@/assets/options/icon_details.svg'),
    duplicate: require('@/assets/options/icon_duplicate.svg'),
    forward: require('@/assets/options/icon_share.svg'),
    leave: require('@/assets/options/icon_leave.svg'),
    markAsRead: require('@/assets/options/icon_unread_filter.svg'),
    move: require('@/assets/options/icon_move.svg'),
    modify: require('@/assets/options/icon_edit_texte.svg'),
    new: require('@assets/options/icon_add_2.svg'),
    openFile: require('@assets/documents.svg'),
    paste: require('@/assets/options/icon_duplicate.svg'),
    permissions: require('@/assets/options/icon_permissions.svg'),
    share: require('@/assets/options/icon_share.svg'),
    rename: require('@/assets/options/icon_edit_texte.svg'),
    refresh: require('@/assets/options/icon_refresh.svg'),
    reply: require('@/assets/options/icon_answer.svg'),
    replyAll: require('@/assets/options/icon_answer_all.svg'),
    upload: require('@/assets/options/icon_upload.svg')
  }
}

const defaultImagesKeys = [
  'default_news_0',
  'default_school_news_0',
  'default_access_0'
]

export {
  icons,
  defaultImagesKeys
}
