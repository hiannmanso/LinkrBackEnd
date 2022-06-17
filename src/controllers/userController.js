import usersRepository from '../repositories/usersRepository.js'

export async function createUser(req, res) {
    const user = req.body;
  
    try {
      const existingUsers = await usersRepository.getUserByEmail(user.email)
      if (existingUsers.rowCount > 0) {
        return res.sendStatus(409); // conflict
      }
  
      const {name, email, picture, password} = user;
      await usersRepository.createUser(name, email, picture, password);
    
      res.sendStatus(201); // created
    } catch (error) {
      console.log(error);
      return res.sendStatus(500); // server error
    }
}

export async function getUser(req, res) {
  const { userID } = req.params
  
    try {
      const users = await usersRepository.getUserById(userID);
      if (users.rowCount === 0) {
        return res.sendStatus(422); 
      }

      res.send(users.rows);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500); // server error
    }
}



