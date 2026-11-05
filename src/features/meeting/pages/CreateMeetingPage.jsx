import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMeeting } from "../api/meetingApi";
import PageShell from "../../../shared/components/PageShell";
import Toast from "../../../shared/components/Toast";
import { useToast } from "../../../shared/hooks/useToast";
import BackButton from "../../../shared/components/BackButton";
import { CoffeeIcon, UtensilsIcon, MapPinIcon } from "../../../shared/components/Icons";

// 모임에서 찾을 장소 종류. value는 서버의 PlaceCategory와 같은 값이다
const PLACE_OPTIONS = [
  { value: "CAFE", label: "카페", hint: "카페만 추천해요", Icon: CoffeeIcon },
  { value: "MEAL", label: "식당", hint: "식당만 추천해요", Icon: UtensilsIcon },
  { value: "ANY", label: "둘 다", hint: "카페와 식당을 모두 추천해요", Icon: MapPinIcon },
];

function CreateMeetingPage() {
  const navigate = useNavigate();
  const [meetingName, setMeetingName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("ANY"); // 기본값은 예전 동작(카페+식당)과 같은 "둘 다"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast, showToast, closeToast } = useToast();
  const showNotice = ({ type, message }) => showToast(message, type);

  const handleCreate = async () => {
    if (!meetingName.trim()) {
      showNotice({ type: "error", message: "모임 이름을 입력해주세요." });
      return;
    }

    try {
      setIsSubmitting(true);
      closeToast();

      const data = await createMeeting(meetingName, description, category);
      const meetingId = data.id || data.meetingId || 1;
      navigate(`/participate/${meetingId}`);
    } catch (error) {
      showNotice({ type: "error", message: error.message || "모임을 만들지 못했어요." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell className="relative flex flex-col overflow-hidden px-6 py-10">

        <BackButton className="mb-10" />

        <section className="mb-10">
          <h1 className="text-[28px] font-extrabold leading-tight tracking-[-1px] text-[#191f28]">모임을 만들어볼까요?</h1>
          <p className="mt-2.5 text-sm leading-[1.7] text-gray-500">모임 이름과 찾을 장소 종류를 정해주세요.</p>
        </section>

        <section className="mb-8 space-y-5">
          <div>
            <label className="mb-2.5 block text-[13px] font-bold text-gray-700">모임 이름</label>
            <input
              type="text"
              placeholder="모임 이름 입력"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              disabled={isSubmitting}
              className="h-[54px] w-full rounded-2xl border-[1.5px] border-gray-200 bg-white px-4 text-[15px] font-medium outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          <div>
            <label className="mb-2.5 block text-[13px] font-bold text-gray-700">설명</label>
            <input
              type="text"
              placeholder="모임에 대한 간단한 설명"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="h-[54px] w-full rounded-2xl border-[1.5px] border-gray-200 bg-white px-4 text-[15px] font-medium outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          <div>
            <p className="mb-2.5 block text-[13px] font-bold text-gray-700">찾을 장소</p>
            <div role="radiogroup" aria-label="찾을 장소 종류" className="grid grid-cols-3 gap-2.5">
              {PLACE_OPTIONS.map((option) => {
                const { value, label, Icon } = option;
                const selected = category === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={isSubmitting}
                    onClick={() => setCategory(value)}
                    className={`flex h-[84px] flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] text-[13px] font-extrabold transition active:scale-[0.98] disabled:opacity-60 ${
                      selected
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-200 bg-white text-gray-500"
                    }`}
                  >
                    <Icon size={24} />
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2.5 text-xs text-gray-400">
              {PLACE_OPTIONS.find((option) => option.value === category)?.hint}
            </p>
          </div>
        </section>

        <div className="mt-auto pt-8">
          <button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="h-[54px] w-full rounded-2xl bg-blue-500 text-base font-extrabold text-white transition hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isSubmitting ? "생성 중..." : "모임 생성하기"}
          </button>
        </div>

        {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={closeToast} />}

    </PageShell>
  );
}

export default CreateMeetingPage;
