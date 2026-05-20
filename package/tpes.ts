interface NestProjectStructure {
  modules: ModuleNode[];
  controllers: ControllerNode[];
  providers: ProviderNode[];
}
interface ModuleNode {
  name: string;
  controllers: string[];
  providers: string[];
  imports: string[];
  exports: string[];
}
interface ControllerNode {
  name: string;
  prefix: string;
  dependencies: string[];
  routers: RouterNode[];
}
interface RouterNode {
  name: string;
  path: string;
  method: string;
}
interface ProviderNode {
  name: string;
  dependencies: string[];
  services: ServiceNode[];
}
interface ServiceNode {
  name: string;
}

export { NestProjectStructure };
