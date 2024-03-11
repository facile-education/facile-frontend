import { icons } from '@/constants/icons'

const contextMenus = {
  messagingMenu: [
    {
      name: 'reply',
      i18nKey: 'Messaging.reply',
      icon: icons.options.reply,
      position: 2,
      hasSeparator: false
    },
    {
      name: 'replyAll',
      i18nKey: 'Messaging.replyAll',
      icon: icons.options.replyAll,
      position: 3,
      hasSeparator: false
    },
    {
      name: 'forward',
      i18nKey: 'Messaging.forward',
      icon: icons.options.forward,
      position: 4,
      hasSeparator: false
    },
    {
      name: 'delete',
      i18nKey: 'Messaging.deleteMessage',
      icon: icons.options.delete,
      iconSize: '25px',
      position: 5,
      hasSeparator: false
    }
  ],
  messagingMultiSelectionMenu: [
    {
      name: 'delete',
      i18nKey: 'Messaging.deleteMessage',
      icon: icons.options.delete,
      position: 1,
      hasSeparator: false
    }
  ],
  messagingMarkAsReadMenu: [
    {
      name: 'markAsRead',
      i18nKey: 'Messaging.markAsRead',
      icon: icons.options.markAsRead,
      position: 0,
      hasSeparator: false
    }
  ],
  messagingThreadsOptions: [
    {
      name: 'markAsRead',
      i18nKey: 'Messaging.markAsRead',
      position: 0,
      hasSeparator: true
    },
    {
      name: 'markAsUnread',
      i18nKey: 'Messaging.markAsUnread',
      position: 1,
      hasSeparator: true
    },
    {
      name: 'delete',
      i18nKey: 'Messaging.deleteMessage',
      position: 2,
      hasSeparator: false
    }
  ],
  messagingEditDraftMenu: [
    {
      name: 'editDraft',
      i18nKey: 'Messaging.editDraft',
      icon: icons.options.modify,
      position: 0,
      hasSeparator: false
    }
  ],
  messagingMarkAsUnreadMenu: [
    {
      name: 'markAsUnread',
      i18nKey: 'Messaging.markAsUnread',
      icon: icons.options.markAsRead,
      position: 0,
      hasSeparator: false
    }
  ]
}

const updateDeleteContextMenu = [
  {
    name: 'update',
    i18nKey: 'Commons.update',
    icon: icons.options.rename,
    position: 1,
    hasSeparator: false
  },
  {
    name: 'delete',
    i18nKey: 'Commons.delete',
    icon: icons.options.delete,
    position: 2,
    hasSeparator: false
  }
]

export default contextMenus
export { updateDeleteContextMenu }
