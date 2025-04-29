export function validateEnvVariables(): void {

  if (!process.env.AUTH_SERVICE_URL) {
    console.error("Authentication service url not defined");
  }
  if (!process.env.COMPANY_SERVICE_URL) {
    console.error("compnay service url not defined");
  }
  if(!process.env.JWT_SECRET){
    console.error("jwtsecret not defined");
  }
  if(!process.env.FRONTEND_URL){
    console.error("FRONTEND_URL not defined");
  }
  if(!process.env.COMMUNICATION_SERVICE_URL){
    console.error("COMMUNICATION_SERVICE_URL not defined");
  }
  if(!process.env.REDIS_HOST){
    console.error("REDIS_HOST not defined");
  }
  if(!process.env.REDIS_PORT){
    console.error("REDIS_PORT not defined");
  }



  
}

