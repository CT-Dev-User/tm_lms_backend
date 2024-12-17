import bcrypt from "bcryptjs";
export const hashpassword = async (password) => {
  try {
    const round = 10;
    const hashedpassword = await bcrypt.hash(password, round);
    return hashedpassword;
  } catch (error) {
    console.log(error);
  }
};

export const compare = async (password, hashingpassword) => {
  return bcrypt.compare(password, hashingpassword);
};
