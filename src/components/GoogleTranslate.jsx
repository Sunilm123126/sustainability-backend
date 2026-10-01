import React, { useEffect } from "react";

function GoogleTranslate() {
    useEffect(() => {
        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        includedLanguages:
                            "en,ta,hi,te,ml,kn,bn,mr,gu,pa,fr,de,es,it,pt,ru,ja,ko,zh-CN,ar",
                        autoDisplay: false,
                    },
                    "google_translate_element"
                );
            }
        };

        const existingScript = document.getElementById(
            "google-translate-script"
        );

        if (!existingScript) {
            const script = document.createElement("script");

            script.id = "google-translate-script";
            script.src =
                "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;

            document.body.appendChild(script);
        } else if (window.google && window.google.translate) {
            window.googleTranslateElementInit();
        }

        return () => {
            window.googleTranslateElementInit = undefined;
        };
    }, []);

    return (
        <div
            id="google_translate_element"
            className="google-translate"
        ></div>
    );
}

export default GoogleTranslate;