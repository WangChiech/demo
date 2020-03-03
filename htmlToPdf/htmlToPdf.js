// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

let title = ''
let pageDataList = []
let doneNum = 0
let PDF = new JsPDF('', 'pt', 'a4')

export default{
  install (Vue, options) {
    Vue.prototype.getPdf = async function (elements) {
        title = this.htmlTitle
        elements.forEach((value,i) => {
            creatCanvasImg(elements, i)
        })
      
    }
    async function creatCanvasImg(elements, i) {
        await html2Canvas(document.querySelector(elements[i]), {
            allowTaint: true
        }).then(function (canvas) {
            let contentWidth = canvas.width
            let contentHeight = canvas.height
            let pageHeight = contentWidth / 592.28 * 841.89
            let leftHeight = contentHeight
            let position = 0
            let imgWidth = 595.28
            let imgHeight = 592.28 / contentWidth * contentHeight
            let pageData = canvas.toDataURL('image/jpeg', 1.0)
            pageDataList.push({
                imgHeight,
                contentHeight,
                pageData
            })
            doneNum++
            if (doneNum === elements.length) {
                let nowCanvasListH = 0
                let beforeCanvasListH = 0
                pageDataList.forEach((item, index) => {
                    nowCanvasListH += item.contentHeight

                    if(nowCanvasListH < pageHeight) {
                        PDF.addImage(item.pageData, 'JPEG', 0, beforeCanvasListH, imgWidth, item.imgHeight)
                        beforeCanvasListH = item.imgHeight
                    } else {
                        PDF.addPage()
                        PDF.addImage(item.pageData, 'JPEG', 0, 25, imgWidth, item.imgHeight)
                        beforeCanvasListH = item.imgHeight
                    } 
                }) 
                PDF.save(title + '.pdf')
                doneNum = 0
            }
            
        })
    }
  }
}