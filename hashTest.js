const argon2 = require('argon2');

(async () => {
  const password = 'testpassword';
  try {
    // Hash the password
    const hashedPassword = await argon2.hash(password, { type: argon2.argon2id });
    console.log('Hashed Password:', hashedPassword);

    // Verify the password
    const isMatch = await argon2.verify(hashedPassword, password);
    console.log('Do the passwords match?', isMatch);
  } catch (err) {
    console.error('Error during password hashing/verification:', err);
  }
})();
