import knex from '../database/connection';
import { Request, Response } from 'express';

class PointsController {

    async show(request: Request, response: Response) {

        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(404).json({ message: 'Point not found' });
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('title');

        return response.json({ point, items });

    }

    async index(request: Request, response: Response) {

        const { city, state, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('state', String(state))
            .distinct()
            .select('points.*');

        return response.json(points);

    }

    async create(request: Request, response: Response) {

        const {
            name,
            email,
            whatsapp,
            city,
            state,
            latitude,
            longitude,
            items
        } = request.body;

        // O código acima ('desestruturação') é equivalente a:
        // const name = request.body.name;
        // const email = request.body.email;
        // etc...

        const trx = await knex.transaction();

        const point = {
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            city,
            state,
            latitude,
            longitude
        };
        // Não há necessidade de colocar no código acima (short syntax)
        // name: name, email: email
        // se o nome for igual

        const insertedIds = await trx('points').insert(point);
        const point_id = insertedIds[0];

        const pointItems = items.map((item_id: number) => {
            return {
                item_id,
                point_id: point_id // point_id: point_id desnecessário
            }
        })

        await trx('point_items').insert(pointItems);
        await trx.commit();

        console.log('inserido');

        return response.status(201).json({
            id: point_id,
            ...point // spread operator
        });

    }

}

export default PointsController;