// src/server/models/PoetryCollectionItem.js
import db from '../db.js';

export default class PoetryCollectionItem {
    constructor({ id, collection_id, poem_id, display_order }) {
        this.id = id;
        this.collection_id = collection_id;
        this.poem_id = poem_id;
        this.display_order = display_order;
    }

    static async findAllByCollectionId(collectionId) {
        const sql = `SELECT p.* FROM poems p 
                     JOIN poetry_collection_items pci ON p.id = pci.poem_id 
                     WHERE pci.collection_id = ? 
                     ORDER BY pci.display_order ASC`;
        const { rows } = await db.query(sql, [collectionId]);
        return rows; // Return the poem objects in order
    }

    static async create(data) {
        const { collection_id, poem_id, display_order } = data;
        const sql = `INSERT INTO poetry_collection_items (collection_id, poem_id, display_order) 
                     VALUES (?, ?, ?)`;
        const { rows } = await db.query(sql, [collection_id, poem_id, display_order || 0]);
        return rows;
    }
}
