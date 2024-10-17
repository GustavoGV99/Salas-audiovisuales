import { pool } from '../db.js';
import { generarToken, tokenVerificationError } from '../util/tokenManager.js'
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {

  try {
    console.log("Entro en login", req.body);
    const { rol_usu, nom_usu, contrasenia_usu } = req.body;
    const [rows] = await pool.query("SELECT * FROM usuario WHERE rol_usu = ? AND nom_usu = ? AND contrasenia_usu = ? ", [rol_usu, nom_usu, contrasenia_usu]);
    console.log("Respuesta de rows: ", rows);
    if (!rows[0]) {
      return res.status(400).json({
        message: "Datos incorrectos"
      });
    }
    delete rows[0].contrasenia_usu;
    const { expiresIn, token } = generarToken(rows[0].id_usu, res);
    console.log(expiresIn, token);
    let cookieToken = req.cookies.token;
    console.log(`cookieToken: ${cookieToken}_________________________`);
    res.json({ token, user: rows[0], expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Error en login" })
  }
};


export const cerrarSesion = async (req, res) => {
  // console.log("A limipar cookie");
  res.clearCookie('token', {
    // path: '/',
    httpOnly: false,
    secure: false,
    sameSite: 'none'
  });
  let cookie = req.cookies.token;
  console.log(`Mi Cookie: ${ cookie }`);

  res.json({ ok: "logout" });
 
};

export const session = async (req, res) => {
  try {
    let cookieToken = req.cookies.token;
    console.log(`cookieToken: ${cookieToken}_________________________`);
    if (!cookieToken) throw new Error("No existe el token en las cookies");//al hacer este throw redirige al catch y el error lo guarda en error.message
    const {exp} = jwt.verify(cookieToken, process.env.TOKEN_SECRET);//payload es la informacion del token como info usuario/expiracion/creacion
    res.json({ token:cookieToken,expiresIn:exp });
  } catch (error) {
    res.status(401).send({ error: tokenVerificationError[error.message]|| error.message});
    // return res.status(400).json({ error: "Error en login" })
  }
};