import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(1, "Пароль обязателен"),
});

export const registerSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(8, "Пароль должен быть минимум 8 символов"),
  name: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Текущий пароль обязателен"),
  newPassword: z.string().min(8, "Новый пароль должен быть минимум 8 символов"),
});

// Admin schemas
export const adminLoginSchema = z.object({
  username: z.string().min(1, "Логин обязателен"),
  password: z.string().min(1, "Пароль обязателен"),
});

export const deleteSubmissionSchema = z.object({
  id: z.string().min(1, "ID заявки не указан"),
});

export const updateSubmissionStatusSchema = z.object({
  id: z.string().min(1, "ID заявки не указан"),
  status: z.enum(["NEW", "IN_PROGRESS", "PROCESSED"]),
});

// Contact schemas
export const contactSubmitSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  email: z.string().email("Некорректный email"),
  phone: z.string().optional().nullable(),
  message: z.string().min(1, "Сообщение обязательно"),
  service: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
});

export const contactConfirmSchema = z.object({
  token: z.string().min(1, "Token отсутствует"),
});

// Account schemas
export const exportSubmissionSchema = z.object({
  id: z.string().min(1, "ID required"),
});
