import {Pool} from 'pg'

import {Ms} from '../dataType'

export class Db {
    private pool: Pool
    private static instance: Db

    private constructor () {
        this.pool = new Pool()
    }

    public static getInstance (): Db {

        if (!Db.instance) {
            Db.instance = new Db()
        }
        return Db.instance
    }

    async getMs ({language, table}: { language?: string, table: string }): Promise<Ms[]> {
        const client = await this.pool.connect()
        try {
            const text = `SELECT * FROM ${language}."${table}"`
            const res = await client.query(text)
            const rows: Ms[] = res.rows
            return rows
        } finally {
            client.release()
        }
    }

    async getMsSingle ({language = 'cn', table, row_id}: { language?: string, table: string, row_id: number }): Promise<string> {
        if (row_id === 0) {
            return ''
        }

        const client = await this.pool.connect()
        try {
            const text = `SELECT * FROM ${language}."${table}" WHERE row_id = $1`
            const res = await client.query(text, [row_id])
            if (res.rowCount !== 1) {
                throw new Error(`Cannot find row: ${table} WHERE row_id = ${row_id}`)
            }
            const row: Ms = res.rows[0]
            return row.name
        } finally {
            client.release()
        }
    }

    async getDataTable<T>({table}: { table: string }): Promise<T[]> {
        const client = await this.pool.connect()
        try {
            const text = `SELECT * FROM data."${table}"`
            const res = await client.query(text)
            const rows: T[] = res.rows
            return rows
        } finally {
            client.release()
        }
    }

    async getDataTableRow<T>({table, row_id}: { table: string, row_id: number }): Promise<T> {
        const client = await this.pool.connect()
        try {
            const text = `SELECT * FROM data."${table}" WHERE "row_id" = $1`
            const res = await client.query(text, [row_id])
            if (res.rowCount !== 1) {
                throw new Error(`Cannot find row: ${table} WHERE "row_id" = ${row_id}`)
            }
            const rows: T[] = res.rows
            return rows[0]
        } finally {
            client.release()
        }
    }

    async getDataTableRowWhere<T>({table, field, value}: { table: string, field: string, value: string }): Promise<T[]> {
        const client = await this.pool.connect()
        try {
            const text = `SELECT * FROM data."${table}" WHERE "${field}" = $1`
            console.log(text)
            const res = await client.query(text, [value])
            if (res.rowCount < 1) {
                throw new Error(`Cannot find row: ${table} WHERE "${field}" = ${value}`)
            }
            const rows: T[] = res.rows
            return rows
        } finally {
            client.release()
        }
    }

    async getDataTableAny ({table}: { table: string }): Promise<any[]> {
        const client = await this.pool.connect()
        try {
            const text = `SELECT * FROM data."${table}"`
            const res = await client.query(text)
            const rows = res.rows
            return rows
        } finally {
            client.release()
        }
    }

}
