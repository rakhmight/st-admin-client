import * as ExcelJS from 'exceljs'

export default class JsExcelTemplateBase {
  workbook = new ExcelJS.Workbook()

  mergeCellsInSheet(sh, cell, type){
    let sheet = this.workbook.getWorksheet(sh+1)

    if(type == 'general') sheet.mergeCells(`D${13+cell}`, `E${13+cell}`)
    if(type == 'retake') sheet.mergeCells(`E${13+cell}`, `F${13+cell}`)
  }

  addSheet(name, type){
    let sheetToClone = this.workbook.getWorksheet(1);
    let cloneSheet = this.workbook.addWorksheet(name);
    const tmpModel = structuredClone(sheetToClone.model);  // Create Deep Clone of Original Sheet's Model

    tmpModel.name = cloneSheet.name;  // Update Cloned Model's Name to Match the Cloned Sheet Name
    tmpModel.id = cloneSheet.id;  // Update Cloned Model's Name to Match the Cloned Sheet Name
      // Replace Cloned Sheet's Model
    cloneSheet.model = tmpModel;
    cloneSheet.mergeCells('B1', type == 'retake' ? 'F1' : 'E1');
    cloneSheet.mergeCells('B2', type == 'retake' ? 'F2' : 'E2');
    cloneSheet.mergeCells('B3', type == 'retake' ? 'F3' : 'E3');
    cloneSheet.mergeCells('B4', type == 'retake' ? 'F4' : 'E4');
    cloneSheet.mergeCells('B5', type == 'retake' ? 'F5' : 'E5');
    cloneSheet.mergeCells('B6', type == 'retake' ? 'F6' : 'E6');
    cloneSheet.mergeCells('B7', type == 'retake' ? 'F7' : 'E7');
  }

  renameSheet(sh, name){
    const sheetToClone = this.workbook.getWorksheet(sh+1);
    sheetToClone._name = name
    sheetToClone.name = name
    sheetToClone.model.name = name
  }

  set(sh, name, value, options) {
    const sheet = this.workbook.worksheets[sh]

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return
      }      
      sheet.eachRow((row, rowIndex) => {
        let rowDuplicated = false
        const duplicateAndSetCell = (text, columnIndex) => {
          const fieldNames = this.getFieldNames(text, name)
          for (const fieldName of fieldNames) {
            if (options?.duplicateCellIfArray) {
              if (!rowDuplicated) {
                for (let i = 1; i < value.length; i++) {
                  row.getCell(columnIndex + i).value = row.getCell(columnIndex).value
                }
                rowDuplicated = true
              }
              for (let i = 0; i < value.length; i++) {
                this.setCell(row.getCell(columnIndex + i), `{${name}.${fieldName}}`, value[i][fieldName])
              }
            } else {
              if (!rowDuplicated) {
                if (value.length > 1) {
                  sheet.duplicateRow(rowIndex, value.length - 1, true)
                }
                rowDuplicated = true
              }
              for (let i = 0; i < value.length; i++) {
                this.setCell(sheet.getRow(rowIndex + i).getCell(columnIndex), `{${name}.${fieldName}}`, value[i][fieldName])
              }
            }
          }
        }
        row.eachCell((cell, columnIndex) => {
          if (typeof cell.value === 'string') {
            duplicateAndSetCell(cell.value, columnIndex)
          } else if (typeof cell.value === 'object' && cell.value) {
            const richTextCell = cell.value
            if (richTextCell.richText && Array.isArray(richTextCell.richText)) {
              for (const richText of richTextCell.richText) {
                duplicateAndSetCell(richText.text, columnIndex)
              }
            }
          }
        })
      })
    } else {
        sheet.eachRow((row) => {
            row.eachCell((cell) => {
              this.setCell(cell, `{${name}}`, value)
            })
        })
    }
  }

  toArrayBuffer() {
    return this.workbook.xlsx.writeBuffer()
  }

  getFieldNames(text, name) {
    const fieldNames = []
    let position = 0
    while (position >= 0 && position < text.length) {
      const index = text.indexOf(`{${name}.`, position)
      if (index >= 0) {
        const endIndex = text.indexOf('}', index + `{${name}.`.length)
        if (endIndex >= 0) {
          fieldNames.push(text.substring(index + `{${name}.`.length, endIndex))
          position = endIndex
        } else {
          break
        }
      } else {
        break
      }
    }
    return fieldNames
  }

  setCell(cell, name, value) {
    if (cell.value) {
      if (typeof cell.value === 'string') {
        if (cell.value.includes(name)) {
          cell.value = cell.value === name ? value : cell.value.split(name).join(String(value))
        }
      } else if (typeof cell.value === 'object') {
        const richTextCell = cell.value
        if (richTextCell.richText && Array.isArray(richTextCell.richText)) {
          for (const richText of richTextCell.richText) {
            if (richText.text.includes(name)) {
              richText.text = richText.text === name ? String(value) : richText.text.split(name).join(String(value))
            }
          }
        }
      }
    }
  }
}