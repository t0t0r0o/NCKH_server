const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getPublicKeyByName = async (name) => {
  try {
    const record = await prisma.publicKey.findUnique({
      where: { name: name },
    });

    let objData = {
      name: record.name,
      key: record.key,
    };
    if (record) {
      return { status: true, data: objData };
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
    const record = await prisma.publicKey.create({
      data: {
        name: name,
        key: publickey,
        createdat: String(
          new Date().getTime() / 1000 - (new Date().getTime() % 1000)
        ),
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

module.exports = { getPublicKeyByName, createPublicKey };
