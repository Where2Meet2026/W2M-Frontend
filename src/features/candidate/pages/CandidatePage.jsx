import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCandidates } from "../api/candidateApi";
import PageShell from "../../../shared/components/PageShell";

function CandidatePage() {
    const navigate = useNavigate();
    const { meetingId } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [candidates, setCandidates] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect( () => {
        const fetchCandidates = async() => {
            try{
                setIsLoading(true);
                setErrorMessage("");

                const data = await getCandidates(meetingId);
                setCandidates(data.candidates || data || []);
            }catch (error) {
                setErrorMessage("후보 장소를 불러오는 중 문제가 발생했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCandidates();
    }, [meetingId]);

    return (
        <PageShell className="flex flex-col px-6 py-10">
            <button
            onClick={() => navigate(-1)}
            className="mb-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full
            border-0 bg-gray-100 transition active:scale-95"
            aria-label="뒤로가기"            
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#191f28"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            {isLoading ? (
                <div></div>
            ) : errorMessage ? (
                <div>{errorMessage}</div>
            ) : (
                <div> </div>
            )}
        </PageShell>
    );
}
export default CandidatePage;
