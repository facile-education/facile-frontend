import moment from 'moment'

var NeroUtils = {
  Date: {
    // Format date in parameter
    formatToString (momentDate) {
      var today = moment()
      var lastWeek = moment().subtract(7, 'days')

      // If the day is today
      if (momentDate.isSame(today, 'day')) {
        return momentDate.format('LT')

      // Compare if date is in last 7 days
      } else if (momentDate.isAfter(lastWeek, 'days') && momentDate.isBefore(today, 'days')) {
        return momentDate.format('dddd')

      // If date is before last week or in the future
      } else {
        return momentDate.format('L')
      }
    }
  },
  Document: {
    File: {
      // Extensions used in Nero app
      Extension: {
        audioExtensionList: ['mp3', 'wav', 'wma'],
        convertExtensionList: ['wav', 'wma', 'avi', 'm4v', 'mpg', 'mpeg', 'mov'],
        documentExtensionList: ['pdf'],
        imageExtensionList: ['gif', 'jpeg', 'jpg', 'png'],
        officeExtensionList: ['odp', 'ppt', 'sxi', 'csv', 'ods', 'sxc', 'tsv', 'xls', 'doc', 'odt', 'rtf', 'sxw', 'txt', 'docx', 'xlsx', 'pptx'],
        otherExtensionList: ['epub', 'html'],
        supportedExtensionList () {
          // TODO condition on officeExtensions
          return [...this.documentExtensionList, ...this.officeExtensionList,
            ...this.imageExtensionList, ...this.audioExtensionList,
            ...this.videoExtensionList, ...this.otherExtensionList]
        },
        videoExtensionList: ['mp4', 'avi', 'm4v', 'mpg', 'mpeg', 'mov']
      },
      isViewable (fileName) {
        var extension = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase()
        return (NeroUtils.Document.File.Extension.supportedExtensionList().includes(extension))
      }
    }
  }
}

export default NeroUtils
