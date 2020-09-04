const adminPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
const adminPrivateKeyParsed = adminPrivateKey.replace(/\\n/g, '\n');

module.exports = {
  type: 'service_account',
  project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  private_key: adminPrivateKeyParsed,
  client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: process.env.FIREBASE_ADMIN_URI,
  token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_CERT_PROVIDER_URL,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_CERT,
};
