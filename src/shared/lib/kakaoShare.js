// buttonTitle: 메시지 아래 버튼 문구 (결과 공유는 "모임 확인하기", 초대는 "모임 참여하기")
export function shareToKakao ({title, description, link, buttonTitle = "모임 확인하기"}) {
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
                title: buttonTitle,
                link: { mobileWebUrl: link, webUrl: link},
            },
        ],
    });
}