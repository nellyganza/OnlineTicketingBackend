// const pdf = require('html-pdf');

// const htmlToPdf = async (html, resolve) => {
//   try {
//     let result;
//     // const doc = new jsPDF({
//     //   orientation: "landscape",
//     //   unit: "in",
//     //   format: [4, 2]
//     // });
//     // const options = { landscape: true };
//     // const file = { content: html };
//     // return await html_to_pdf.generatePdf(file, options);
//     return pdf.create(html, { type:'png' }).toBuffer((err, res) => {
//       if (err) return console.log(err);
//       resolve(res);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// export default htmlToPdf;

const html_to_pdf = require('html-pdf-node');

const htmlToPdf = async (html, resolve) => {
  try {
    // const doc = new jsPDF({
    //   orientation: "landscape",
    //   unit: "in",
    //   format: [4, 2]
    // });
    const options = { landscape: true, height: '200mm' };
    const file = { content: html };
    return html_to_pdf.generatePdf(file, options, (err, res) => {
      if (err) return console.log(err);
      resolve(res);
    });
  } catch (error) {
    console.log(error);
  }
};

export default htmlToPdf;
