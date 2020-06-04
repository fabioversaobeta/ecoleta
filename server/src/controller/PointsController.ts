import { Request, Response } from 'express'
import knex from '../database/connection'

class PointsController {
    async index(request: Request, response: Response) {
        // cidade, uf, items (Query Params)
        const { city, uf, items } = request.query

        const paredItems = String(items)
            .split(',')
            .map(item => Number(item.trim()))

        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', paredItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*')

        return response.json(points)
    }

    async show(request: Request, response: Response) {
        const { id } = request.params

        const point = await knex('points').where('id', id).first()

        if (!point) {
            return response.status(400).json({ message: 'Point not found.' })
        }

        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            .select('items.title')

        return response.json({ point, items })
    }

    async create(request: Request, response: Response) {
        try {
            await knex.transaction(async trx => {
                const {
                    name,
                    email,
                    whatsapp,
                    latitude,
                    longitude,
                    city,
                    uf,
                    items
                } = request.body
            
                // const trx = await knex.transaction()

                const point = {
                    image: 'image-fake',
                    name,
                    email,
                    whatsapp,
                    latitude,
                    longitude,
                    city,
                    uf
                }
            
                const insertedIds = await knex('points').insert(point).transacting(trx)
            
                const point_id = insertedIds[0]
            
                const pointItems = items.map((item_id: number) => {
                    return {
                        item_id,
                        point_id
                    }
                })
            
                await knex('points_items').insert(pointItems).transacting(trx)
            
                return response.json({ 
                    success: true,  
                    id: point_id,
                    ... point
                })
            })
        } catch(error) {
            console.error(error);
        }
    }
}

export default PointsController