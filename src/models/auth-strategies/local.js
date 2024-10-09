import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import db from "../../../infra/database.js";
import user from "./../user.js";
import passport from "passport";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const parsedUser = await user.listById(id);
    done(null, parsedUser);
  } catch (error) {
    done(error, false);
  }
});

// prettier-ignore
passport.use(new LocalStrategy({
  usernameField: 'email',
},
  async (email, password, done) => {
    try {
      const parsedUser = await getuserbyEmail(email)
      if (!parsedUser || !(await bcrypt.compare(password, parsedUser.password_hash))) throw new Error('Invalid Credentials')
      done(null, parsedUser)
    } catch (error) {
      done(null, false, {message: error.message})
    }
  })
)

async function getuserbyEmail(email) {
  const response = await db.query({
    text: "SELECT id, name, username, email, role, password_hash FROM member WHERE email=$1;",
    values: [email],
  });
  return response.rows[0];
}
