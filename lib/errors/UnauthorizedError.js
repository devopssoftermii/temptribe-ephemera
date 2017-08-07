function UnauthorizedError (code, error = {
  status: 401,
  message: 'Missing authorization'
}) {
  this.name = "UnauthorizedError";
  this.message = error.message;
  Error.call(this, error.message);
  Error.captureStackTrace(this, this.constructor);
  this.code = code;
  this.status = error.status;
  this.inner = error;
}

UnauthorizedError.prototype = Object.create(Error.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;

module.exports = UnauthorizedError;
