import { RecaptchaVerifier } from "firebase/auth";
import { authentification } from "../firebase/firebase-config";

export const generateRecaptcha = (id: string) => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
        authentification,
        id,
        {
            size: "invisible",
            callback: (response: any) => {
                console.log("response", response);
            },
        }
    );
};
