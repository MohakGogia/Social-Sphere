export enum Roles {
  Admin = 'Admin',
  User = 'User'
}

export enum UserProfileTabs {
  About,
  Photos,
  Messages
}

export enum MessageType {
  Unread = 0,
  Inbox = 1,
  Outbox = 2
}

export enum HeaderFieldType {
  Text = 1,
  DateTime = 2,
  Number = 3,
  Link = 4,
  Action = 5
}

export enum FilterType {
  None = 1,
  Text = 2,
  Numeric = 3,
  Date = 4,
  Boolean = 5
}
