//מייבא את ספריית nodemailer לצורך שליחת מיילים
const nodemailer = require("nodemailer");

class CodeStore {
  constructor() {
    this.store = new Map();
  }
  //שומר קוד לפי אימייל
  saveCode(email, code) {
    this.store.set(email, code);
  }
  // מחזיר את הקוד השמור
  getCode(email) {
    return this.store.get(email);
  }

  // מוחק את הקוד אחרי השימוש
  clearCode(email) {
    this.store.delete(email);
  }
}
//יוצרים מופע יחיד של CodeStore שישמש בכל הקריאות.
const codeStore = new CodeStore();

//מחזירה מחרוזת של קוד אימות רנדומלי בן 6 ספרות.
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// בודקים שהאימייל תקין
// יוצרים קוד
// שומרים אותו ב־Map
async function sendCode(email) {
  if (!email || typeof email !== "string") {
    throw new Error("Invalid email.");
  }

  const code = generateCode();
  codeStore.saveCode(email, code);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "doolanyatrips@gmail.com",
      pass: "loeu irzo fbxx iuep",
    },
  });

  const mailOptions = {
    from: "doolanyatrips@gmail.com",
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
  };

  //שולח את המייל ומחזיר תשובה חיובית
  await transporter.sendMail(mailOptions);

  return { message: "✅ Code sent to email." };
}

// בודקים שהקוד תקין
function verifyCode(email, code) {
  if (!email || !code) {
    return { success: false, message: "Missing email or code" };
  }

  const storedCode = codeStore.getCode(email);
  if (storedCode === code) {
    codeStore.clearCode(email);
    return { success: true, message: "✅ Verification approved" };
  } else {
    return { success: false, message: "❌ Invalid code" };
  }
}

module.exports = { sendCode, verifyCode };
