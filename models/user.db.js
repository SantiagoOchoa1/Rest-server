const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es requerido"],
  },
  correo: {
    type: String,
    required: [true, "el correo es requerido"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "el correo es requerido"],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
  estate: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject();
  return user;
};

module.exports = model("User", userSchema);
