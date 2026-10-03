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
                <div className="flex flex-1 flex-col items-center justify-center pb-20">
                    <p className="mb-6 text-xs font-extrabold tracking-[0.5px] text-blue-500"> 
                        WHERE2MEET  
                    </p>

                    <div className="relative mb-8 flex h-[180px] w-[180px] items-center justify-center" >
                        <div className="absolute inset-0 animate-spin rounded-full border-[10px] 
                        border-gray-100 border-t-blue-500 border-r-blue-500 border-b-blue-500 "/>
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#3b82f6"
                                strokeWidth= "2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                            </div>
                        </div>

                    <h2 className="mb-1.5 text-lg font-extrabold text-[#191f28]">
                        맞춤 장소를 찾고 있어요
                    </h2>
                    <p className="m-0 text-[13px] text-gray-400"> 잠시만 기다려주세요</p>
                </div>
            ) : errorMessage ? (
                <div>{errorMessage}</div>
            ) : (
                <div> </div>
            )}
        </PageShell>
    );
}
export default CandidatePage;
