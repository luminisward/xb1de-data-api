import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'

import dotenv from 'dotenv'
import {getParser} from './dataTable'

dotenv.config()


const app = new Koa()
app.use(bodyParser())
app.use(logger())


interface RequestData {
    game: string
    table: string
    row_id: number|undefined
    field: string|undefined
    value: string|undefined
    language: string
}

app.use(async ctx => {

    console.log(ctx.request.body)

    const {game, table, row_id, language, field, value}: RequestData = ctx.request.body

    if (game === 'xb1') {
        const parser = await getParser(table, language)
        if (row_id) {
            const result = await parser.parseOne(row_id)
            ctx.body = result
        } else if (field) {
            const v = value || ''
            const result = await parser.parseOneByField(field, v)
            ctx.body = result
        } else {
            const result = await parser.parse()
            ctx.body = result
        }
    }


})

app.listen(3000)
