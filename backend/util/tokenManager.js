import jwt from 'jsonwebtoken'
export const generarToken = (uid,res) => {
  try {
    console.log('token secret: ',process.env.TOKEN_SECRET);
    const expiresIn = 60 * 60 * 24 * 30;
    const token = jwt.sign({ uid }, process.env.TOKEN_SECRET, { expiresIn });
    res.cookie("token", token,{
      httpOnly:false,
      sameSite:"none",
      secure: false, //true para produccion, false solo para postman
      expires: new Date(Date.now() + expiresIn * 1000)
    });
    console.log("DESPUES RES:COOKIE");
    
    return { token, expiresIn };
  } catch (error) {
    console.log(error);
  }
};

export const tokenVerificationError = {
  "invalid signature": "La firma del token no es valida",
  "jwt expired": "JWT expirado",
  "invalid token": "Token no valido",
  "No Bearer": "Utiliza el formato Bearer",
  "jwt malformed": "JWT formato no valido",
  "jwt must be provided": "no tiene un JWT"
};