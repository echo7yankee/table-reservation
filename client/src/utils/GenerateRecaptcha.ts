import { RecaptchaVerifier } from "firebase/auth";
import { authentification } from "../firebase/firebase-config";

export const generateRecaptcha = (id: string) => {
    try {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                authentification,
                id,
                {
                    size: "invisible",
                    callback: (response: any) => {
                        console.log("response", response);
                    },
                    expiredCallback: () => {
                        console.log("expired");
                    },
                }
            );
        }

        window.recaptchaVerifier.render();
    } catch (error) {
        console.log("error", error);
    }
};
