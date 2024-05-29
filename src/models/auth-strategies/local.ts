import { Strategy } from 'passport-local';
import bcrypt from 'bcrypt';
import db from '../../../infra/database';
import user from './../user';
import { UUID } from 'crypto';
import passport from 'passport';

passport.serializeUser((user: any, done) => {
  console.log('serializing:', user);
  done(null, user.id);
});

passport.deserializeUser(async (id: UUID, done) => {
  console.log('deserializing id:', id);
  try {
    const parsedUser = await user.listById(id);
    done(null, parsedUser);
  } catch (error) {
    done(error, null);
  }
});

// prettier-ignore
passport.use('local',
  new Strategy({usernameField: 'email'}, async (email, password, done) => {
    console.log('email is:', email)
    console.log('password is:', password)
    try {
      const parsedUser = await getuserbyEmail(email)
      if (!parsedUser || !(await bcrypt.compare(password, parsedUser.password_hash))) throw new Error('Invalid Credentials')
      done(null, parsedUser)
    } catch (error) {
      done(error, null)
    }
  })
)

async function getuserbyEmail(email: string) {
  const response = await db.query({
    text: 'SELECT id, name, username, email, role, password_hash FROM member WHERE email=$1;',
    values: [email],
  });
  return response.rows[0];
}
