import { object, nonempty, string, define } from 'superstruct';
import isEmail from 'is-email';

const emailValidator = (value: unknown): boolean => {
  return typeof value === 'string' && isEmail(value);
};

export const SignInRequestStruct = object({
    email: define('Email', emailValidator),
    password: nonempty(string()),
});
