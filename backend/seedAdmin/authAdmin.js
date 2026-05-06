const bcrypt = require('bcrypt');
const path = require('path');
const MongoB = require('../config/db');
const User = require('../model/user');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

console.log(" Script started...");

const createAdmin = async () => {
  try {
    await MongoB();
    console.log(" DB Connected");


    console.log(" Admin Email:", process.env.EMAIL_ADMIN);
    if (!process.env.EMAIL_ADMIN || !process.env.PASSWORD_ADMIN) {
      console.log("EMAIL_ADMIN or PASSWORD_ADMIN missing in .env");
      return;
    }

    const hashPass = await bcrypt.hash(process.env.PASSWORD_ADMIN, 10);
    const adminexist = await User.findOne({
      email: process.env.EMAIL_ADMIN,
    });

    if (adminexist) {
      adminexist.name = adminexist.name || "Aryan";
      adminexist.password = hashPass;
      adminexist.role = "admin";
      await adminexist.save();
      console.log(" Admin already exists, password and role updated");
      return;
    }

    const user = await User.create({
      name: "Aryan",
      email: process.env.EMAIL_ADMIN,
      password: hashPass,
      role: "admin",
    });

    console.log(" Admin created successfully");
    console.log(user);

  } catch (err) {
    console.log("ERROR:", err);
  } finally {
    process.exit();
  }
};

createAdmin();
