import JsExcelTemplateBase from './common'

/**
 * @public
 */
export default class JsExcelTemplate extends JsExcelTemplateBase {
  static async fromArrayBuffer(arrayBuffer) {
    const template = new JsExcelTemplate()
    await template.workbook.xlsx.load(arrayBuffer)
    return template
  }

  async toBlob() {
    const arrayBuffer = await this.toArrayBuffer()
    return new Blob([arrayBuffer], { type: 'application/octet-stream' })
  }
}