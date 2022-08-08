import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const sessionOptions = {
  password:
    "oCh0KwoQycFEHKypz5IFsjht9hexGzoHuuj1hhHC8qx7Vr3q56yXgLot5jp6x3pcOmYFYI23fYVOOgGEznBQRcFPjGNvmKS331YvGCErb2pDk2oZX0F18YoaWM8FJF9IaKKM20snOgnIhG1PpRrhetwhiNxOJmHryBRQQkyjk89y1OY1Mu6IgvFbSGp8Ny9ZEPWMATIyo07jTKp1Fs6tGP8sNvwaGWnK50AgxFnHpzpI5tDoMhveE7VT334b355YyWEb2A3u8Hszv3IoXLiyhp8pHFyYn1lPNNsJYiLVWIR7F47a1w9h4AQ3GZJSoakzSjU63Ltx70fnoS6KybocydN6xneBRJykoyckM1XosVIqceJjehxgx2f7jp6G2iwUwF2J1yrikam0V0dhEg7oXKkjGw13MGm7ads2hi4h356235opXwKgxKYSDcigSkoKm1OyEC9s89FIWR21fhZJVpaPj9mhurJt5uzSPCP4ubmL3tPFjcFHms0oijBJOUuXYz4hGSbNyfdN",
  cookieName: "sunset_market",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler) {
  return withIronSessionSsr(handler, sessionOptions);
}
