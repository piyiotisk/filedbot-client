import { isValidEmail } from './formValidation';

describe('.isValidEmail(email)', () => {
    it('returns true if the email is valid', () => {
        const validEmailAddress = 'username@example.com';

        const result = isValidEmail(validEmailAddress);

        expect(result).toBe(true);
    });

    it('returns true if the email is valid', () => {
        const validEmailAddress = 'username@a';

        const result = isValidEmail(validEmailAddress);

        expect(result).toBe(true);
    });

    it('returns false if the email is in-valid', () => {
        const inValidEmailAddress = 'username@';

        const result = isValidEmail(inValidEmailAddress);

        expect(result).toBe(false);
    });

    it('returns false if the email is in-valid', () => {
        const inValidEmailAddress = 'username@.com';

        const result = isValidEmail(inValidEmailAddress);

        expect(result).toBe(false);
    });

    it('returns false if the email is in-valid', () => {
        const inValidEmailAddress = '';

        const result = isValidEmail(inValidEmailAddress);

        expect(result).toBe(false);
    });

    it('returns false if the email is null', () => {
        const inValidEmailAddress = null;

        const result = isValidEmail(inValidEmailAddress);

        expect(result).toBe(false);
    });

    it('returns false if the email is undefined', () => {
        const inValidEmailAddress = undefined;

        const result = isValidEmail(inValidEmailAddress);

        expect(result).toBe(false);
    });
});
