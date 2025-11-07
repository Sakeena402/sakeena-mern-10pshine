export interface INote {
  _id: string
  userId: string
  title: string
  content: string
  tags: string[]
  plainText: string;
  bgColor: string;
  pinned: boolean;
  collaborators: string[]
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  pinEnabled?: boolean        
  pinCode?: string            
}

export interface User {
  id: string
  email: string
  name: string
}
