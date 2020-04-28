import * as session from "./middlewares/session";
const middlewares: any = [session.createSession()];

export default middlewares;
