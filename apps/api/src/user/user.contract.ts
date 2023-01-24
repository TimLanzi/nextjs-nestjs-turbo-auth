import { initNestServer } from '@ts-rest/nest';
import { contract } from "@acme/rpc";

export const s = initNestServer(contract);
export type UserControllerShape = typeof s.controllerShape;
export type UserRouteShape = typeof s.routeShapes['user'];