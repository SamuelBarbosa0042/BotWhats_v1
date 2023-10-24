import nodemailer from "nodemailer";

class enviaEmail {
  mailer: nodemailer.Transporter<any>;

  constructor() {
    this.mailer = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "-1", // generated ethereal user
        pass: "-1", // generated ethereal password
      },
    });
  }

  async enviaIsso(
    remetente: any,
    destinatario: any,
    assunto: any,
    filename: { name: any; path: any },
    corpo: any
  ) {
    const mailOptions = {
      from: remetente,
      to: [destinatario],
      subject: assunto,
      text: corpo,
      html: corpo,
      attachments: [
        {
          filename: filename.name,
          path: filename.path,
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    };
    this.mailer.sendMail(
      mailOptions,
      function (error: any, info: { response: string }) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email enviado: " + info.response);
        }
      }
    );
  }
}
export { enviaEmail };
