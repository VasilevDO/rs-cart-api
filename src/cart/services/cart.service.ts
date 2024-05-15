import { Injectable } from '@nestjs/common';
import { getClient } from '../../db';

import { v4 } from 'uuid';

import { Cart } from '../models';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string): Promise<Cart | undefined> {
    const client = await getClient()

    const {rows } = await client.query(`
      SELECT
        carts.id AS cart_id,
        carts.user_id,
        carts.created_at,
        carts.updated_at,
        carts.status,
        cart_items.id AS cart_item_id,
        cart_items.count,
        products.id AS product_id,
        products.title,
        products.description,
        products.price
      FROM
        carts
      LEFT JOIN
        cart_items ON carts.id = cart_items.cart_id
      LEFT JOIN
        products ON cart_items.product_id = products.id
      WHERE
        carts.user_id = $1
      ORDER BY updated_at DESC;
    `, [userId]);

    const cartsMap = {};

    rows.forEach(row => {
      if (!cartsMap[row.cart_id]) {
        cartsMap[row.cart_id] = {
          id: row.cart_id,
          user_id: row.user_id,
          created_at: row.created_at,
          updated_at: row.updated_at,
          status: row.status,
          items: []
        };
      }

      if (row.cart_item_id) {
        cartsMap[row.cart_id].items.push({
          id: row.cart_item_id,
          count: row.count,
          product: {
            id: row.product_id,
            title: row.title,
            description: row.description,
            price: row.price
          }
        });
      }
    });

    const carts = Object.values(cartsMap);

    const cart = carts[0] as Cart | undefined;

    await client.end()

    return cart
  }

  async createByUserId(userId: string) {
    const client = await getClient();
    const id = v4();

   await client.query(
      'insert into carts (id, user_id, created_at, updated_at, status) values ($1, $2, $3, $4, $5)',
      [id, userId, new Date(), new Date(), 'OPEN'],
    );
      await client.end();
      return {
        id,
        items: [],
      };
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const client = await getClient();
    const { id: cartId, ...rest } = await this.findOrCreateByUserId(userId);

    for (const item of items) {
      const id = v4();

      await client.query(
        `DELETE FROM cart_items WHERE cart_id=$1 AND product_id=$2`,
        [cartId, item.product.id],
      );

      if (item.count) {
        await client.query(
          'insert into cart_items (id, cart_id, product_id, count) values ($1, $2, $3, $4)',
          [id, cartId, item.product.id, item.count],
        );
      }
    }
    await client.end();
    return { id: cartId, items: [...items] };
  }

  async removeByUserId(userId: string): Promise<void> {
    const client = await getClient();
    await client.query('DELETE FROM carts WHERE user_id = $1', [userId]);
    await client.end();
  }
}
