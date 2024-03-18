// TODO not export all in one time to improve performances
const icons = {
  frenchFlag: require('@assets/icons/frenchFlag.svg'),
  englishFlag: require('@assets/icons/englishFlag.svg'),
  deutschFlag: require('@assets/icons/germanyFlag.svg'),
  italianFlag: require('@assets/icons/italyFlag.svg'),
  file: require('@assets/icons/file.svg'),
  folder: require('@assets/icons/folder.svg'),
  folderOpen: require('@assets/icons/folder.svg'),
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
    wav: require('@assets/icons/file_audio.svg'),
    zip: 'file-zipper'
  },
  options: {
    copyUrl: require('@assets/icons/duplicate.svg'),
    download: 'icon-download',
    delete: 'icon-trash',
    details: require('@assets/icons/details.svg'),
    duplicate: require('@assets/icons/duplicate.svg'),
    forward: require('@assets/icons/share.svg'),
    markAsRead: 'icon-filter',
    move: require('@assets/icons/move.svg'),
    modify: 'icon-edit',
    new: require('@assets/icons/add2.svg'),
    openFile: 'icon-folder',
    paste: require('@assets/icons/duplicate.svg'),
    permissions: require('@assets/icons/lock.svg'),
    save: 'icon-folder',
    share: require('@assets/icons/share.svg'),
    rename: 'icon-edit',
    refresh: require('@assets/icons/refresh.svg'),
    reply: require('@assets/icons/answer.svg'),
    replyAll: require('@assets/icons/answer_all.svg'),
    upload: 'icon-upload'
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
