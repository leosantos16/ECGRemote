const mongoose = require('mongoose');

module.exports = function () {
  const AuthSchema = new mongoose.Schema({
    redirect_uri: {
      type: String,
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
    },
    client_id: {
      type: String,
    },
    scope: {
      type: String,
    },
    aud: {
      type: String,
    },
    state: {
      type: String,
    },
    paciente_id: {
      type: mongoose.Types.ObjectId,
    },
  });

  const AuthModel = mongoose.model('Auth', AuthSchema);

  return AuthModel;
};
