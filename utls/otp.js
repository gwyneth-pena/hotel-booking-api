import { OTP } from "../models/otp.model.js";

const MAX_VERIFICATION_ATTEMPTS = 5;

export const generateOTP = (length = 4) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

export const saveOTP = async (otp, key, module, expiryMinutes) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    const identifier = await generateSHA256(`${key}-${module}-${secretKey}`);
    const expiryAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    await OTP.findOneAndDelete({ identifier: identifier });

    const saved = await OTP({ identifier, otp, expiryAt }).save();
    if (saved) return { status: "SUCCESS" };
    else {
      return { status: "FAILED" };
    }
  } catch (e) {
    return { status: "FAILED" };
  }
};

export const verifyOTP = async (otp, key, module) => {
  let isVerified = false;

  try {
    const secretKey = process.env.SECRET_KEY;
    const identifier = await generateSHA256(`${key}-${module}-${secretKey}`);
    const match = await OTP.findOne({ identifier: identifier, otp: otp });

    if (match && match.attempts < MAX_VERIFICATION_ATTEMPTS) {
      isVerified = true;
      await OTP.findByIdAndDelete(match._id);
    } else {
      await OTP.findOneAndUpdate(
        { identifier: identifier },
        { $inc: { attempts: 1 } }
      );
    }
  } catch (e) {
    console.log(e);
  } finally {
    return {
      isVerified,
    };
  }
};

const generateSHA256 = async (input) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};
