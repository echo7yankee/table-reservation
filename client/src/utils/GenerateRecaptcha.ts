import { RecaptchaVerifier } from "firebase/auth";
import { authentification } from "../firebase/firebase-config";

export const generateRecaptcha = (id: string) => {
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(authentification, id, {
            size: "invisible",
            callback: (response: any) => {
                console.log("response", response);
            },
            expiredCallback: () => {
                console.log("expired");
            },
        });
    }

    window.recaptchaVerifier.render();
};
