import _ from 'lodash'
import {BaseParser, BaseFields, getParser, text2html} from './index'

enum ItemType {
    武器 = 2,
    宝珠,
    头部防具,
    身体防具,
    手臂防具,
    腰部防具,
    腿部防具,
    结晶,
    收藏品,
    素材,
    贵重品,
    战技教学书
}

export interface TableType extends BaseFields {
    'itemType': number
    'itemID': number
    'icon': number
    'icon_base': number
    'rankType': number
    'percent': number
    'item_keep': number
    'comment': number
}


export interface TableWithText extends TableType {
    itemType: any
    itemID: any
    comment: any

}

export default class Bdat_qtMNU_qt extends BaseParser {

    async parse (): Promise<any[]> {
        return []
    }

    async parseOne (row_id: number): Promise<any> {
        const row = await this.db.getDataTableRow<TableType>({table: this.table, row_id})
        const result: TableWithText = _.clone(row)

        result.itemType = ItemType[row.itemType]

        let itemTable: string

        switch (row.itemType) {
            case ItemType.武器:
                itemTable = 'bdat_common.ITM_wpnlist'
                break
            case ItemType.宝珠:
                itemTable = 'bdat_common.BTL_skilllist'
                break
            case ItemType.头部防具:
                itemTable = 'bdat_common.ITM_equiplist'
                break
            case ItemType.身体防具:
                itemTable = 'bdat_common.ITM_equiplist'
                break
            case ItemType.手臂防具:
                itemTable = 'bdat_common.ITM_equiplist'
                break
            case ItemType.腰部防具:
                itemTable = 'bdat_common.ITM_equiplist'
                break
            case ItemType.腿部防具:
                itemTable = 'bdat_common.ITM_equiplist'
                break
            case ItemType.结晶:
                itemTable = 'bdat_common.ITM_crystallist'
                break
            case ItemType.收藏品:
                itemTable = 'bdat_common.ITM_collectlist'
                break
            case ItemType.素材:
                itemTable = 'bdat_common.ITM_materiallist'
                break
            case ItemType.贵重品:
                itemTable = 'bdat_common.ITM_valuablelist'
                break
            case ItemType.战技教学书:
                itemTable = 'bdat_common.ITM_artslist'
                break
            default:
                throw new Error('item type not match')
        }
        const itemParser = await getParser(itemTable, this.language)
        const itemData = await itemParser.parseOne(row.itemID)

        // 装备幻化，ITM_equiplist不含装备种类数据，需要在这里拿到种类
        if (itemTable === 'bdat_common.ITM_equiplist') {
            enum PartsTable {
                ITM_headlist = ItemType.头部防具,
                ITM_bodylist = ItemType.身体防具,
                ITM_armlist = ItemType.手臂防具,
                ITM_waistlist = ItemType.腰部防具,
                ITM_legglist = ItemType.腿部防具
            }

            const ITM_partslist = await getParser(`bdat_common.${PartsTable[row.itemType]}`, this.language)

            itemData.pc = await Promise.all(
                [...itemData.pc.splice(0, 8), ...itemData.pc.splice(13, 2)].map(async (partsId: number) => {
                    if (partsId > 0) {
                        const parts = await ITM_partslist.parseOne(partsId)
                        return parts
                    }
                    return null
                })
            )
        }

        result.itemID = itemData


        if (row.comment > 0) {
            let mesParser: BaseParser
            if (row.itemType <= 8) {
                mesParser = await getParser('bdat_menu_item.MNU_item_mes_a', this.language)
            } else {
                mesParser = await getParser('bdat_menu_item.MNU_item_mes_b', this.language)
            }
            const mes = await mesParser.parseOne(row.comment)
            result.comment = text2html(mes.comment)

        } else {
            result.comment = ''
        }


        return result

    }
}
