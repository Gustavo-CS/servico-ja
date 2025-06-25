import { jwtVerify } from 'jose';

export async function verifyJWT(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("Erro ao verificar JWT:", err);
    throw new Error("Token inválido");
  }
}