export interface ApplicationConfig {
  dbConnectionUri: string;
  port: number
  routers: Function[];
  services: Function[];
}