import express from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const pointsController = new PointsController();
const itemsController = new ItemsController();
const routes = express.Router();

routes.get('/', (request, response) => {
    return response.json({ 'message': 'Hello world!' });
});

routes.get('/items', itemsController.index);

routes.get('/points/:id', pointsController.show);
routes.get('/points', pointsController.index);
routes.post('/points', pointsController.create);

// index, show, create, update, delete

export default routes;