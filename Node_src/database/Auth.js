const mongoose = require('mongoose');

module.exports = function () {
  const AuthSchema = new mongoose.Schema({
    redirect_uris: {
      type: [String],
      required: true,
    },
    client_name: {
      type: String,
    },
    token_endpoint_auth_method: {
      type: String,
    },
    jwks_uri: {
      type: String,
      required: true,
    },
  });

  const AuthModel = mongoose.model('Auth', AuthSchema);

  return AuthModel;
};
