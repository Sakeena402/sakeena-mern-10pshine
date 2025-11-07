import type { Request, Response, NextFunction } from "express"
import type Joi from "joi"

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      const errors: Record<string, string> = {}
      error.details.forEach((detail) => {
        errors[detail.path.join(".")] = detail.message
      })
      return res.status(400).json({ success: false, message: "Validation error", errors })
    }

    req.body = value
    next()
  }
}
