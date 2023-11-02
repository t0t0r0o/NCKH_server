const Jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authentication = async (username, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username, password: password },
      select: { id: true, username: true, email: true },
    });

    if (user) {
      console.log(user);
      console.log(Jwt.sign({ username }, process.env.SECRET_KEY));
      return {
        status: true,
        data: { token: Jwt.sign({ username }, process.env.SECRET_KEY) },
      };
    }
    return { status: false, message: "Not Found" };
  } catch (err) {
    console.log(err);
    return err;
  } finally {
    async () => await prisma.$disconnect();
  }
};

const addUser = async (username, password, email) => {
  try {
    const record = await prisma.user.create({
      data: {
        username: username,
        password: password,
        email: email
      },
    });

    if (record) {
      console.log(record);
      return { status: true, data: record };
    }
    return { status: false, message: "Created Failure" };
  } catch (err) {
    console.log(err);
    return { isSuccess: false, error: err };
  } finally {
    async () => await prisma.$disconnect();
  }
};

module.exports = { authentication, addUser };
