import { useCallback, useState } from "react";

// 방금 한 동작의 결과(복사했어요, 나갔어요, 실패했어요 등)를 Toast로 보여주기 위한 상태.
//   const { toast, showToast, closeToast } = useToast();
//   showToast("링크를 복사했어요.");               // 성공 (기본)
//   showToast("링크를 복사하지 못했어요.", "error");  // 실패
//   {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={closeToast} />}
// 화면을 불러오지 못한 오류나 입력 폼의 오류는 사라지면 안 되니까 Toast가 아니라 화면 안에 그대로 둔다.
export function useToast() {
  const [toast, setToast] = useState(null);

  // id가 바뀌면 Toast가 새로 그려져서, 앞의 안내가 떠 있어도 시간이 다시 시작된다
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const closeToast = useCallback(() => setToast(null), []);

  return { toast, showToast, closeToast };
}
