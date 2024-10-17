import jwt from "jsonwebtoken";
import { tokenVerificationError } from '../util/tokenManager.js';

export const requiereToken = (req, res, next) => {
  try {

    // let cookie = req.cookies.token;
    // console.log(requiere token Mi cookie: ${cookie}___________________________________________);
    console.log(req.headers);
    let token = req.headers.authorization;
    console.log("TOKEN DEL HEADER: ", token);
    if (!token) throw new Error("No existe el token en el header");//al hacer este throw redirige al catch y el error lo guarda en error.message

    token = token.split(" ")[1];
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);//payload es la informacion del token como info usuario/expiracion/creacion
    console.log(payload);

    req.uid = payload.uid;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).send({ error: tokenVerificationError[error.message] || error.message });
  }
}