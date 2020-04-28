import service from './controllers/service';
import userH5 from './controllers/user-h5';

export default {
	'/api/service': service,
	'/api/h5/user': userH5
};
