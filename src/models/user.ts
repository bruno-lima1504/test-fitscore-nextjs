import prismaClient from "../prisma";
import { NotFoundError } from "../errors/errors";

async function createUser() {}

async function update() {}

async function updateEmail(id: string, newEmail: string) {
  const updatedUser = await runUpdateEmailQuery(id, newEmail);
  return updatedUser;

  async function runUpdateEmailQuery(id: string, newEmail: string) {
    console.log("newEmail", newEmail);
    const existingUser = await prismaClient.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser && existingUser.id !== id) {
      throw new NotFoundError({
        message: "Este email já está sendo usado por outro usuário.",
        action: "Escolha um email diferente.",
      });
    }

    // Atualizar o email do usuário
    const user = await prismaClient.user.update({
      where: { id },
      data: { email: newEmail },
    });

    if (!user) {
      throw new NotFoundError({
        message: "O usuário não foi encontrado no sistema.",
        action: "Verifique se o ID está correto.",
      });
    }

    return user;
  }
}

async function validadeUniqueEmail() {}

async function hashPassword() {}

async function findOneById(id: string) {
  const userFound = await runSelectQuery(id);
  return userFound;

  async function runSelectQuery(id: string) {
    const user = await prismaClient.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundError({
        message: "O id não foi encontrado no sistema.",
        action: "Verifique se o id está correto.",
      });
    }

    return user;
  }
}

async function findOneByEmail(email: string) {
  const userFound = await runSelectQuery(email);
  return userFound;

  async function runSelectQuery(email: string) {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundError({
        message: "O email não foi encontrado no sistema.",
        action: "Verifique se o email está correto.",
      });
    }

    return user;
  }
}

async function deleteUser() {}

async function ListUsers() {}

const user = {
  createUser,
  findOneById,
  findOneByEmail,
  ListUsers,
  update,
  updateEmail,
  delete: deleteUser,
};

export default user;
