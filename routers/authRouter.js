import { Router } from "express";
import authController from "../controllers/authController.js";
import { check } from "express-validator"

const router = new Router();


router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
router.post('/register', [
    check('username', "This field couldn't be empty").notEmpty(),
    check('password', "Password must be not less than 4 symbols").isLength({min: 4})
], authController.register);
router.post('/login', [
    check('username', "This field couldn't be empty").notEmpty()
], authController.login);
router.get('/users', authController.getUsers);

export default router;