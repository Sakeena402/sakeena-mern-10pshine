export interface INote {
  _id: string
  userId: string
  title: string
  content: string
  tags: string[]
  collaborators: string[]
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
}
