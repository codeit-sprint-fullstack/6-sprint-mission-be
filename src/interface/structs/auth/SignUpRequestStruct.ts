import { coerce, object, nonempty, string, define } from 'superstruct';
import isEmail from 'is-email';

const emailValidator = (value: unknown): boolean => {
  return typeof value === 'string' && isEmail(value);
};

export const SignUpRequestStruct = object({
    email: define('Email', emailValidator),
    nickname: coerce(nonempty(string()), string(), (value) => value.trim()),
    password: nonempty(string()),
    passwordConfirmation: nonempty(string()),
});
