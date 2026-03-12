import { validationMessages } from "../constants/message";

export function validateLogin(form) {
  const errors = {};

  if (!form.email?.trim()) {
    errors.email = validationMessages.email.required;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = validationMessages.email.invalid;
  }

  if (!form.password) {
    errors.password = validationMessages.password.required;
  } else if (form.password.length < 6) {
    errors.password = validationMessages.password.short;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

export function validateRegister(form) {
  const errors = {};

  if (!form.name?.trim()) {
    errors.name = validationMessages.name.required;
  } else if (form.name.trim().length < 3) {
    errors.name = validationMessages.name.invalid;
  }

  if (!form.email?.trim()) {
    errors.email = validationMessages.email.required;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = validationMessages.email.invalid;
  }

  if (!form.password) {
    errors.password = validationMessages.password.required;
  } else if (form.password.length < 6) {
    errors.password = validationMessages.password.short;
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = validationMessages.confirmPassword.required;
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = validationMessages.confirmPassword.mismatch;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}