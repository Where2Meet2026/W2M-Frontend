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
            // 카카오 서버가 직접 가져가는 이미지라 배포된 사이트의 공개 주소여야 한다 (localhost에서는 안 보임)
            imageUrl: `${window.location.origin}/share-thumbnail.png`,
            imageWidth: 800,
            imageHeight: 400,
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