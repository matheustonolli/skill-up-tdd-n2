const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

export function createUserService(UserModel) {
  async function assertUserExists(id) {
    const user = await UserModel.findByPk(id);
    if (!user) throw new Error('Usuário não encontrado.');
    return user;
  }

  async function createUser(data) {
    if (!data.username || data.username.trim() === '')
      throw new Error('Nome de usuário é obrigatório.');

    if (!data.email || data.email.trim() === '')
      throw new Error('Email é obrigatório.');

    if (!isValidEmail(data.email))
      throw new Error('Email inválido.');

    const existing = await UserModel.findOne({ where: { email: data.email } });
    if (existing) throw new Error('Email já cadastrado.');

    return await UserModel.create(data);
  }

  async function findUserById(id) {
    return await assertUserExists(id);
  }

  async function updateUser(id, data) {
    const user = await assertUserExists(id);

    if (data.email !== undefined) {
      if (!isValidEmail(data.email)) throw new Error('Email inválido.');

      const conflict = await UserModel.findOne({ where: { email: data.email } });
      if (conflict && conflict.id !== id) throw new Error('Email já cadastrado.');
    }

    await user.update(data);
    return user;
  }

  async function deleteUser(id) {
    const user = await assertUserExists(id);
    await user.destroy();
  }

  return { createUser, findUserById, updateUser, deleteUser };
}