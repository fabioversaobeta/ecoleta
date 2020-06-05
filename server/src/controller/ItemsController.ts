import { Request, Response } from 'express'
import knex from '../database/connection'

class ItemsController {
    async index(request: Request, response: Response) {
        function getIPAddress() {
            var interfaces = require('os').networkInterfaces();
            for (var devName in interfaces) {
              var iface = interfaces[devName];
          
              for (var i = 0; i < iface.length; i++) {
                var alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                  return alias.address;
              }
            }
          
            return '0.0.0.0';
        }

        const items = await knex('items').select('*')

        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                // image_url: `http://localhost:3333/uploads/${item.image}`,
                image_url: `http://${String(getIPAddress())}:3333/uploads/${item.image}`
            }
        })
    
        return response.json(serializedItems)
    }
}

export default ItemsController