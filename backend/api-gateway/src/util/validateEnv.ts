export function validateEnvVariables(): void {

  if (!process.env.AUTH_SERVICE_URL) {
    console.error("Authentication service url not defined");
  }
  if (!process.env.COMPANY_SERVICE_URL) {
    console.error("compnay service url not defined");
  }
}