import { initNestServer } from '@ts-rest/nest';
import { contract } from "@acme/rpc";

export const s = initNestServer(contract);
export type AuthControllerShape = typeof s.controllerShape;
export type AuthRouteShape = typeof s.routeShapes['auth'];