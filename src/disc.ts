import axios from "axios";
import formData from "form-data";
import fs from "fs";
import qr from "qrcode";

export const sendQrCode = async (code: any) => {
  const form = new formData();

  qr.toFile("./qrCode.png", code, async (err) => {
    if (err) {
      throw err;
    }
    form.append(
      "avatar_url",
      "https://rodcordeiro.github.io/shares/img/vader.png"
    );
    form.append("username", "rod");
    form.append("content", "KODA-Class QRCode");
    form.append("file1", fs.createReadStream("./qrCode.png"));

    await axios
      .post(
        // eslint-disable-next-line no-undef
        "discord_webhook_link",
        form
      )
      .then(() => {
        console.log("QR Code sent. Please verify quickly.");
        fs.unlink("./qrCode.png", () => {});
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  });
};
