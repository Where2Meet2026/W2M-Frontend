export function shareToKakao ({title, description, link}) {
    const { Kakao } = window;

    if(!Kakao) {
        throw new Error("카카오 SDK를 불러오지 못했어요.");
    }
    if(!Kakao.isInitialized()) {
        Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }

    Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
            title,
            description,
            link : { mobileWebUrl: link, webUrl: link},
        },
        buttons: [
            {
                title: "모임 확인하기",
                link: { mobileWebUrl: link, webUrl: link},
            },
        ],
    });
}