let SECURE_COOKIE = false;

if (process.env.NODE_ENV === 'development') {
  SECURE_COOKIE = false;
} else {
  SECURE_COOKIE = true;
}

export { SECURE_COOKIE };
