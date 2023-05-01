export const validatePhoneNumber = (phoneNumber: string) => {
  const phoneNumberRegex = /^92\d{9}$/;
  return phoneNumberRegex.test(phoneNumber);
};
