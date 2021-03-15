import { IncomingMessage, ServerResponse } from 'http'
import crypto from "crypto";
import config from "../config"

const verifyRequestSignature = (req: IncomingMessage, _: ServerResponse, buf: Buffer) => {
    const signature = req.headers["x-hub-signature"] as string;

    if (!signature) {
        console.log("Couldn't validate the signature.");
    } else {
        const elements = signature.split("=");
        const signatureHash = elements[1];
        const expectedHash = crypto
            .createHmac("sha1", config.appSecret)
            .update(buf)
            .digest("hex");
        if (signatureHash != expectedHash) {
            throw new Error("Couldn't validate the request signature.");
        }
    }
};

export default verifyRequestSignature;