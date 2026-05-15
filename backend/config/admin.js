module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "gp_admin_jwt_secret_dev_2024"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT", "gp_api_token_salt_dev_2024"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT", "gp_transfer_token_salt_dev_2024"),
    },
  },
  flags: {
    nps: env.bool("FLAG_NPS", false),
    promoteEE: env.bool("FLAG_PROMOTE_EE", false),
  },
});
