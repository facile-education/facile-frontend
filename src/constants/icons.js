// TODO not export all in one time to improve performances
const icons = {
  file: require('@assets/icons/file.svg'),
  folder: require('@assets/icons/folder3.svg'),
  folderOpen: require('@assets/icons/folder3.svg'),
  extensions: {
    ggb: require('@assets/icons/file_geogebra.svg'),
    gif: require('@assets/icons/file_image.svg'),
    html: require('@assets/icons/file_wisiwig.svg'),
    jpg: require('@assets/icons/file_image.svg'),
    jpeg: require('@assets/icons/file_image.svg'),
    mind: require('@assets/icons/file_mindmap.svg'),
    mp3: require('@assets/icons/file_audio.svg'),
    mp4: require('@assets/icons/file_video.svg'),
    mpg: require('@assets/icons/file_video.svg'),
    mov: require('@assets/icons/file_video.svg'),
    odp: require('@assets/icons/file_odp.svg'),
    ppt: require('@assets/icons/file_odp.svg'),
    sxi: require('@assets/icons/file_odp.svg'),
    pptx: require('@assets/icons/file_odp.svg'),
    csv: require('@assets/icons/file_ods.svg'),
    ods: require('@assets/icons/file_ods.svg'),
    sxc: require('@assets/icons/file_ods.svg'),
    tsv: require('@assets/icons/file_ods.svg'),
    xls: require('@assets/icons/file_ods.svg'),
    xlsx: require('@assets/icons/file_ods.svg'),
    odt: require('@assets/icons/file_odt.svg'),
    doc: require('@assets/icons/file_odt.svg'),
    sxw: require('@assets/icons/file_odt.svg'),
    docx: require('@assets/icons/file_odt.svg'),
    pdf: require('@assets/icons/file_pdf.svg'),
    png: require('@assets/icons/file_image.svg'),
    sb3: require('@assets/icons/file_scratch.svg'),
    wav: 'music',
    zip: 'file-archive'
  },
  options: {
    addToFavorites: 'star',
    copyUrl: require('@assets/icons/duplicate.svg'),
    download: require('@assets/icons/download.svg'),
    delete: require('@/assets/icons/trash.svg'),
    deleteDefinitely: ['far', 'trash-alt'],
    details: require('@assets/icons/details.svg'),
    duplicate: require('@assets/icons/duplicate.svg'),
    forward: require('@assets/icons/share.svg'),
    markAsRead: require('@assets/icons/unread_filter.svg'),
    move: require('@assets/icons/move.svg'),
    modify: require('@assets/icons/pen.svg'),
    new: require('@assets/icons/add2.svg'),
    openFile: require('@assets/icons/folder.svg'),
    paste: require('@assets/icons/duplicate.svg'),
    permissions: require('@assets/icons/lock.svg'),
    save: require('@assets/icons/folder5.svg'),
    share: require('@assets/icons/share.svg'),
    rename: require('@assets/icons/pen.svg'),
    refresh: require('@assets/icons/refresh.svg'),
    reply: require('@assets/icons/answer.svg'),
    replyAll: require('@assets/icons/answer_all.svg'),
    upload: require('@assets/icons/upload.svg')
  }
}

const defaultImagesKeys = [
  'default_news_0',
  'default_school_news_0'
]

export {
  icons,
  defaultImagesKeys
}
