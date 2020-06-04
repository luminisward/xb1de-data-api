import {BaseParser, BaseFields} from './index'

export interface TableType extends BaseFields {
    purpose: number,
    info_prog: number,
    info_succ_A1: number,
    info_succ_A2: number,
    info_succ_A3: number | string,
    info_succ_B1: number | string,
    info_succ_B2: number | string,
    info_succ_B3: number | string,
    info_report: number,
    info_end_A: number,
    info_end_B: number,

    [key: string]: number | string
}

export interface TableWithText extends BaseFields {
    purpose: string,
    info_prog: string,
    info_succ_A1: string,
    info_succ_A2: string,
    info_succ_A3: string,
    info_succ_B1: string,
    info_succ_B2: string,
    info_succ_B3: string,
    info_report: string,
    info_end_A: string,
    info_end_B: string,

    [key: string]: any
}


export default class extends BaseParser {

    async parse (): Promise<TableWithText[]> {
        const rows = await this.db.getDataTable<TableType>({table: this.table})
        const fields: string[] = this.fieldsWithoutRowID(rows[0])

        return await Promise.all(
            rows.map(async row => {
                const newRow = {} as TableWithText
                newRow.row_id = row.row_id
                for (const field of fields) {
                    const row_id = (row[field] ? row[field] : 0) as number
                    const text = await this.db.getMsSingle({table: this.msTable, row_id})
                    newRow[field] = text
                }

                return newRow
            })
        )
    }

    async parseOne (row_id: number): Promise<TableWithText> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const fields: string[] = this.fieldsWithoutRowID(row)
        const newRow = {} as TableWithText
        newRow.row_id = row.row_id
        for (const field of fields) {
            const row_id = (row[field] ? row[field] : 0) as number
            const text = await this.db.getMsSingle({table: this.msTable, row_id})
            newRow[field] = text
        }
        return newRow

    }
}
