import i18n from '@/i18n.js'
import { icons } from '@/constants/icons'

const contextMenus = {
  messagingMenu: [
    {
      name: 'reply',
      title: i18n.global.t('Messaging.reply'),
      icon: icons.options.reply,
      position: 2,
      hasSeparator: false
    },
    {
      name: 'replyAll',
      title: i18n.global.t('Messaging.replyAll'),
      icon: icons.options.replyAll,
      position: 3,
      hasSeparator: false
    },
    {
      name: 'forward',
      title: i18n.global.t('Messaging.forward'),
      icon: icons.options.forward,
      position: 4,
      hasSeparator: false
    },
    {
      name: 'delete',
      title: i18n.global.t('Messaging.deleteMessage'),
      icon: icons.options.delete,
      iconSize: '25px',
      position: 5,
      hasSeparator: false
    }
  ],
  messagingMultiSelectionMenu: [
    {
      name: 'delete',
      title: i18n.global.t('Messaging.deleteMessage'),
      icon: icons.options.delete,
      position: 1,
      hasSeparator: false
    }
  ],
  messagingMarkAsReadMenu: [
    {
      name: 'markAsRead',
      title: i18n.global.t('Messaging.markAsRead'),
      icon: icons.options.markAsRead,
      position: 0,
      hasSeparator: false
    }
  ],
  messagingMarkerMenu: [
    {
      name: 'markAsRead',
      title: i18n.global.t('Messaging.markAsRead'),
      position: 0,
      hasSeparator: true
    },
    {
      name: 'markAsUnread',
      title: i18n.global.t('Messaging.markAsUnread'),
      position: 1,
      hasSeparator: false
    }
  ],
  messagingEditDraftMenu: [
    {
      name: 'editDraft',
      title: i18n.global.t('Messaging.editDraft'),
      icon: icons.options.modify,
      position: 0,
      hasSeparator: false
    }
  ],
  messagingMarkAsUnreadMenu: [
    {
      name: 'markAsUnread',
      title: i18n.global.t('Messaging.markAsUnread'),
      icon: icons.options.markAsRead,
      position: 0,
      hasSeparator: false
    }
  ]
}

export default contextMenus
