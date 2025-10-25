export const sanitizeUser = (user: any) => {
  const { password, refreshToken, ...sanitized } = user.toObject ? user.toObject() : user
  return sanitized
}
