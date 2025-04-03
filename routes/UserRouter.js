const express= require('express');
const UserRouter=express.Router();
const UserController=require('../controllers/UserController');

UserRouter.get('/getAll',UserController.getUsers);
UserRouter.get('/get/:id',UserController.getUser);
UserRouter.post('/register',UserController.createUser);
UserRouter.patch('/update/:id',UserController.updateUser);
UserRouter.delete('/delete/:id',UserController.deleteUser);
UserRouter.post('/login',UserController.Login);


module.exports= UserRouter;
