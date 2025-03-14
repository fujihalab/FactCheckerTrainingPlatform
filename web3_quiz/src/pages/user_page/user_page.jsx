import {Contracts_MetaMask} from "../../contract/contracts";
import {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";
//cssをimport
import "./user_page.css";
import HistoryList from "./component/history_list";
import UserCard from "./component/user_card";

function User_page() {
    const {address} = useParams();

    //User_cardへの表示用
    const [icons, SetIcons] = useState(null);
    const [user_name, Setuser_name] = useState(null);

    const [result, SetResult] = useState(null);
    const [token, Set_token] = useState(null);
    const [state, Set_state] = useState(null);
    //クイズの総数
    const [history_sum, Set_history_sum] = useState(null);
    //現在表示している個数を保持するref
    const now_numRef = useRef(0);
    const targetRef = useRef(null); // ターゲット要素のrefを作成

    let cont = new Contracts_MetaMask();
    const [history_list, Set_history_list] = useState([]);

    //初回のみ実行
    useEffect(() => {
        const get_variable = async () => {
            Set_token(await cont.get_token_balance(address));
            let [user_name, image, result, state] = await cont.get_user_data(address);
            console.log(user_name, image, state);
            Setuser_name(user_name);
            SetIcons(image);
            SetResult(result / 10 ** 18);
            Set_state(state);

            cont.get_user_history_len(address).then((data) => {
                // Promise オブジェクトが解決された後の処理を記述
                console.log(Number(data));
                Set_history_sum(Number(data));
                now_numRef.current = Number(data);
            });
        };
        get_variable();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (history_sum != null) {
        return (
            <div className="mypage">
                <UserCard address={address} icons={icons} user_name={user_name} token={token} result={result} state={state} cont={cont} />
                <HistoryList cont={cont} history_sum={history_sum} Set_history_sum={Set_history_sum} history_list={history_list} Set_history_list={Set_history_list} targetRef={targetRef} now_numRef={now_numRef} address={address} />

                <div className="token-history">
                    <div className="title">Token History</div>
                    <div className="timeline">
                        {history_list.map((history, index) => {
                            // console.log(quiz);
                            return <>{history}</>;
                        })}
                    </div>
                    <div ref={targetRef}>
                        {/* ターゲット要素aの内容 */}
                        now_loading
                    </div>
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}

export default User_page;
