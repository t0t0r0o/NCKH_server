const { PrismaClient } =  require("@prisma/client");
const prisma = new PrismaClient();


const getPublicKeyByName = async (name) => {

  try {
    const key = await prisma.publicKey.findUnique({
      where: { name: name },
    });

    if (key) {
      return { status: true, data: key };
    }
    return { status: false, message: "Not Found" };
  } catch (err) {
    console.log(err);
    return err;
  } finally {
    async () => await prisma.$disconnect();
  }
};

const createPublicKey = async (name, publickey) => {
  try {
    const key = await prisma.publicKey.create({
      data: {
        name: name,
        key: publickey,
        createdat: String((new Date().getTime() / 1000) - (new Date().getTime() % 1000)),
      },
    });
    console.log(key);
    if (key) {
      return { status: true, data: key };
    }
    return { status: false, message: "Created Failure" };
  } catch (err) {
    console.log(err);
    return {isSuccess: false, error: err}
  } finally {
    async () => await prisma.$disconnect();
  }
};

module.exports = { getPublicKeyByName, createPublicKey };
