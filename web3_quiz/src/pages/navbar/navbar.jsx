import {useEffect, useState} from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./navbar.css";
import {AiOutlineUser} from "react-icons/ai";
import {MdOutlineQuiz} from "react-icons/md";
import {RiFileSettingsLine} from "react-icons/ri";
import {AiOutlineUnorderedList} from "react-icons/ai";
import Modal_change_network from "./Modal_change_network";

// Custom CSS class for fixed-width icons
const iconClass = "fixed-width-icon";

function Nav_menu(props) {
    const [useing_address, Set_useing_address] = useState(null);
    const [chain_id, setChain_id] = useState(null);
    const [isTeacher, setIsTeacher] = useState(false);

    useEffect(() => {
        const get_variable = async () => {
            setChain_id(await props.cont.get_chain_id());
            Set_useing_address(await props.cont.get_address());
            setIsTeacher(await props.cont.isTeacher());
        };

        get_variable();
    }, []);

    return (
        <>
            <Modal_change_network chain_id={chain_id} cont={props.cont} />
            <Navbar fixed="bottom" bg="light" className="justify-content-center" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Nav.Item>
                    <Nav.Link eventKey="/list_quiz" href={process.env.PUBLIC_URL + "/list_quiz"}>
                        <AiOutlineUnorderedList size={30} className={iconClass} />
                        <div className="d-flex justify-content-center align-items-center">
                            <font size="2">一覧</font>
                        </div>
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link eventKey="/create_quiz" href={process.env.PUBLIC_URL + "/create_quiz"}>
                        <MdOutlineQuiz size={30} className={iconClass} />
                        <div className="d-flex justify-content-center align-items-center">
                            <font size="2">出題</font>
                        </div>
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link eventKey="user_page" href={process.env.PUBLIC_URL + "/user_page/" + useing_address}>
                        <AiOutlineUser size={30} className={iconClass} />
                        <div className="d-flex justify-content-center align-items-center">
                            <font size="2">myPage</font>
                        </div>
                    </Nav.Link>
                </Nav.Item>

                {isTeacher && (
                    <Nav.Item>
                        <Nav.Link eventKey="edit" href={process.env.PUBLIC_URL + "/edit_list"}>
                            <RiFileSettingsLine size={30} className={iconClass} />
                            <div className="d-flex justify-content-center align-items-center">
                                <font size="2">テストの編集</font>
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                )}
            </Navbar>
        </>
    );
}
export default Nav_menu;
