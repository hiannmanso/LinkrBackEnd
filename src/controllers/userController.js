import usersRepository from '../repositories/usersRepository.js'

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



