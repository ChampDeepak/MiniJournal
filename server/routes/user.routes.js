import Router from 'express'; 
import { jwtAuth } from '../middlewares/jwtAuth.js';
import { getUser } from '../controllers/user.controllers.js';
const userRoutes = Router();
userRoutes.get('/current',jwtAuth,getUser); 
export default userRoutes; 
