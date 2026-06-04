export function createUserController(userService) {
  function sendError(res, status, message) {
    return res.status(status).json({ error: message });
  }

  async function create(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      sendError(res, 400, err.message);
    }
  }

  async function findAll(req, res) {
    const users = await userService.findAll();
    res.status(200).json(users);
  }

  async function findById(req, res) {
    try {
      const user = await userService.findUserById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      sendError(res, 404, err.message);
    }
  }

  async function update(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json(user);
    } catch (err) {
      sendError(res, 404, err.message);
    }
  }

  async function del(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (err) {
      sendError(res, 404, err.message);
    }
  }

  return { create, findAll, findById, update, delete: del };
}