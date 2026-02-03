import crypto from "crypto";

export function generateToken04(
  appID: number,
  userID: string,
  secret: string,
  effectiveTimeInSeconds: number,
  payload?: string
): string {
  const createTime = Math.floor(Date.now() / 1000);
  const tokenInfo = {
    app_id: appID,
    user_id: userID,
    nonce: Math.floor(Math.random() * 2147483647),
    ctime: createTime,
    expire: createTime + effectiveTimeInSeconds,
    payload: payload || ""
  };

  const plaintext = JSON.stringify(tokenInfo);
  const iv = crypto.randomBytes(16).toString("hex").substring(0, 16);
  const cipher = crypto.createCipheriv("aes-128-cbc", secret, iv);
  let ciphertext = cipher.update(plaintext, "utf8", "binary");
  ciphertext += cipher.final("binary");

  const expireTime = tokenInfo.expire;
  const ivLen = iv.length;
  const cipherLen = ciphertext.length;

  const data = Buffer.alloc(8 + 2 + ivLen + 2 + cipherLen);
  data.writeBigInt64BE(BigInt(expireTime), 0);
  data.writeUInt16BE(ivLen, 8);
  data.write(iv, 10, ivLen, "utf8");
  data.writeUInt16BE(cipherLen, 10 + ivLen);
  data.write(ciphertext, 12 + ivLen, cipherLen, "binary");

  return "04" + data.toString("base64");
}