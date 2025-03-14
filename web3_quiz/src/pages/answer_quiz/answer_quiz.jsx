import {Contracts_MetaMask} from "../../contract/contracts";
import Form from "react-bootstrap/Form";
import {useState, useEffect} from "react";
import MDEditor, {selectWord} from "@uiw/react-md-editor";
import {useParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Wait_Modal from "../../contract/wait_Modal";
import {ConstructorFragment} from "ethers/lib/utils";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Simple_quiz from "./quiz_simple";

function Answer_type1(props) {
    return (
        <>
            <a>
                <br />
                選択式
            </a>
            <table className="table">
                <tbody>
                    {props.quiz[6].split(",").map((cont) => {
                        let check_box;
                        if (props.answer == cont) {
                            check_box = (
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={cont}
                                    id="flexCheckChecked"
                                    onChange={() => {
                                        props.setAnswer(cont);
                                    }}
                                    checked
                                />
                            );
                        } else {
                            check_box = (
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    value={cont}
                                    id="flexCheckChecked"
                                    onChange={() => {
                                        props.setAnswer(cont);
                                    }}
                                />
                            );
                        }
                        return (
                            <tr key={cont}>
                                <th scope="col">{check_box}</th>

                                <th scope="col" className="left">
                                    {cont}
                                </th>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}

function Answer_type2(props) {
    const answer_data = props.quiz[6].split(",");
    const pattern = answer_data[0];
    const example = answer_data[1];
    const [error_collect, SetError_Collect] = useState(true);
    useEffect(() => {
        console.log(props.quiz);
        console.log(pattern);
        console.log(example);
    }, []);

    //正規表現のエラー表示
    const handle_Test_pattern = (event, target_set) => {
        const value = event.target.value;

        console.log(pattern);
        // 入力値が正規表現にマッチしない場合は、エラーメッセージを設定
        if (!new RegExp(pattern).test(value)) {
            target_set(true);
            console.log("errr");
        } else {
            target_set(false);
        }
    };

    return (
        <>
            <a>入力形式</a>

            <div className="row">
                <div className="col-10">
                    正解を入力
                    <br />
                    <p>例:{example}</p>
                    {/* 1行のみのフォームにしたい */}
                    <input
                        type="text"
                        className="form-control"
                        value={props.answer}
                        onChange={(event) => {
                            handle_Test_pattern(event, SetError_Collect);
                            props.setAnswer(event.target.value);
                        }}
                    />
                    {error_collect ? "エラー" : "OK"}
                </div>
            </div>
        </>
    );
}

function Answer_quiz(props) {
    const [answer, setAnswer] = useState();
    const [now, setnow] = useState(null);
    const [show, setShow] = useState(false);
    const [content, setContent] = useState("");
    let clean_up;

    let Contract = new Contracts_MetaMask();
    const id = useParams()["id"];
    console.log(id);
    console.log("解答の最大数とこれまでに回答した人数");
    async function getCorrectLimitAndCorrectCount(id) {
        return await Contract.get_respondentCount_and_respondentLimit(id);
    }

    console.log(getCorrectLimitAndCorrectCount(id));

    const [quiz, setQuiz] = useState(null);
    const [simple_quiz, setSimple_quiz] = useState(null);

    const get_quiz = async () => {
        setQuiz(await Contract.get_quiz(id));
        setSimple_quiz(await Contract.get_quiz_simple(id));
    };

    const create_answer = async () => {
        if (parseInt(quiz[8]).toString() <= now) {
            const res = Contract.create_answer(id, answer, setShow, setContent);
        } else {
            alert("まだ回答開始時間になっていません");
        }
    };

    useEffect(() => {
        get_quiz();
        setnow(Math.floor(new Date().getTime() / 1000));
    }, []);

    console.log(simple_quiz);
    if (quiz && simple_quiz) {
        return (
            <Container className="text-left">
                <div>
                    <h3 style={{margin: "50px"}}>{Number(simple_quiz[10]) === 0 ? "初回の回答です。正解するとトークンがもらえます" : Number(simple_quiz[10]) === 1 ? "初回の回答で間違えています。正解してもトークンはもらえません" : Number(simple_quiz[10]) === 2 ? "正解しています" : ""}</h3>
                </div>
                <Simple_quiz quiz={simple_quiz} />

                <div data-color-mode="light" className="left" style={{textAlign: "left"}}>
                    <MDEditor.Markdown source={quiz[5]} />
                </div>
                {(() => {
                    if (Number(quiz[13]) === 0) {
                        return <Answer_type1 quiz={quiz} answer={answer} setAnswer={setAnswer} />;
                    }
                })()}
                {(() => {
                    if (Number(quiz[13]) === 1) {
                        return <Answer_type2 quiz={quiz} answer={answer} setAnswer={setAnswer} />;
                    }
                })()}
                <div className="d-flex justify-content-end">
                    <Button variant="primary" onClick={create_answer}>
                        回答
                    </Button>
                </div>
                <Wait_Modal showFlag={show} />
            </Container>
        );
    } else {
        return <></>;
    }
}

export default Answer_quiz;
