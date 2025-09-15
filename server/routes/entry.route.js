import { Router } from "express";
import { jwtAuth } from "../middlewares/jwtAuth.js";
import { createEntry, getEntries, updateEntry, deleteEntry } from "../controllers/entry.controllers.js";

const entryRouter = Router(); 

entryRouter.post('/createEntry',jwtAuth,createEntry); 
entryRouter.get('/entries', jwtAuth, getEntries);
entryRouter.patch('/entries/:id', jwtAuth, updateEntry);
entryRouter.delete('/entries/:id', jwtAuth, deleteEntry);


export default entryRouter; 