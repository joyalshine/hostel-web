import { React, useEffect, useState } from "react";
import './studentComplaintHistory.css'
import { CLEANING, DISCIPLINE, MAINTENANCE } from "../../dataAssets";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { ColorRing } from "react-loader-spinner";
import CircularProgress from '@mui/material/CircularProgress';

import {
    upadateComplaint,
    setFeedBacktoDB,
    getComplaints,
} from "../../firebase/complains";
import { CSVLink } from "react-csv";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";


const StudentHistoryTable = ({ complaints }) => {
    const [isLoading, setLoading] = useState(false);

    return (
        <div>

            {isLoading ? (
                <div style={{ textAlign: "center" }}>
                    <ColorRing
                        visible={true}
                        height="40"
                        width="40"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
                    />{" "}
                </div>
            ) : complaints.length === 0 ? (
                <div className="alert text-center text-primary">No Complains</div>
            ) : (
                <div className="tableDiv">
                    <table className="table table-hover table-sm">
                        <thead>
                            <tr>
                                <th className="text-center"></th>
                                <th className="text-center">Sno</th>
                                <th>Name</th>
                                <th>Registration No</th>
                                <th>Block/Mess</th>
                                <th>Complaint Type</th>
                                <th>Status</th>
                                <th className="text-center">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints
                                .map((item, index) => {
                                    return (
                                        <TableRow
                                            key={item.id}
                                            complaint={item}
                                            index={index}
                                            complaintType={item.complaintType}
                                        />
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

function TableRow({ complaint, index,  complaintType }) {
    const [expanded, setExpanded] = useState(false);
    const [resolveLoading, setResolveLoading] = useState(false);
    const [denyLoading, setDenyLoading] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [forDatas, setForDatas] = useState("");
    const [item, setItem] = useState({
        ...complaint,
        resolveTime : complaint.resolveTime ? complaint.resolveTime.toDate().toString() : '',
        denyTime : complaint.denyTime ? complaint.denyTime.toDate().toString() : '',
    });
    const [showFeedbackError, setShowFeedbackError] = useState(false);

    const [cookies, setCookie] = useCookies(["user_token"]);
    let userStatus = cookies.user_token;
    let userId = userStatus ? userStatus.userId : ''

    
    useEffect(() => {
        let forData;
        if (complaintType == 'Cleaning') {
            forData = CLEANING[item.category[0]];
            for (var i = 1; i < item.category.length; i++) {
                forData = forData + ", " + CLEANING[item.category[i]];
            }
        }
        else if (complaintType == 'Maintenance') {
            forData = MAINTENANCE[item.category[0]];
            for (var i = 1; i < item.category.length; i++) {
                forData = forData + ", " + MAINTENANCE[item.category[i]];
            }
        }
        else if (complaintType == 'Discipline') { }
        else { }
        setForDatas(forData)
    }, [item])

    function handleFeedback() {
        if (showFeedback) {
            setShowFeedback(false);
            setFeedback("");
        } else {
            setExpanded(true);
            setShowFeedback(true);
        }
    }

    function handleExpand() {
        if (showFeedback) {
            setExpanded(!expanded);
            setShowFeedback(false);
        } else {
            setExpanded(!expanded);
        }
    }

    const handleDeny = async () => {
        if (feedback.length === 0 || feedback === null) {
            setShowFeedbackError(true);
            const Toast = Swal.mixin({
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
            });

            Toast.fire({
                icon: "error",
                title: "Feedback is empty",
            });
        } else {
            setDenyLoading(true)
            await setFeedBacktoDB(complaintType.toLowerCase(), feedback, userId, item);
            setItem({
                ...item,
                status: 'deny',
                feedback: feedback,
                denyTime: Date.now(),
                deniedBy: userId
            })
            setExpanded(false);
            setFeedback("");
            setDenyLoading(false)

            const Toast = Swal.mixin({
                toast: true,
                position: "bottom-end",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
            });

            Toast.fire({
                icon: "success",
                title: "Complaint Denied",
            });
        }
    }

    const handleReslove = async () => {
        setResolveLoading(true)
        const response = await upadateComplaint(complaintType.toLowerCase(), item.id, userId, item);
        setItem({
            ...item,
            status: 'resolve',
            resolveTime: Date.now(),
            resolvedBy: userId
        })

        setExpanded(false);
        setResolveLoading(false)


        const Toast = Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });

        Toast.fire({
            icon: "success",
            title: "Complaint Resloved",
        });
    };

    return (
        <>
            <tr>
                <td className="text-center">{item.status == 'pending' ? <div className="pendingCircle"></div> : item.status == 'deny' ? <div className="deniedCircle"></div> : <div className="successCircle"></div>}</td>
                <td className="text-center">{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.regno}</td>
                <td>{complaintType == 'Mess' ? item.mess : item.block}</td>
                <td>{complaintType}</td>
                <td>
                    <span className={item.status == 'pending' ? 'badge pendingBadge' : item.status == 'deny' ? 'badge deniedBadge' : 'badge successBadge'}>
                        {item.status == 'pending' ? 'PENDING' : item.status == 'deny' ? 'DENIED' : 'RESOLVED'}
                    </span>
                </td>
                <td className="text-center">
                    <button
                        className="btn btn-outline-info btn-sm collapse-btn"
                        onClick={handleExpand}
                        disabled={denyLoading || resolveLoading}
                    >
                        {expanded ? (
                            <i class="bx bx-chevron-up"></i>
                        ) : (
                            <i class="bx bx-chevron-down"></i>
                        )}
                    </button>
                    {
                        item.status == 'pending' || item.status == '' ?
                            <>
                                <button
                                    className="btn btn-outline-success btn-sm collapse-btn success-btn"
                                    onClick={handleReslove}
                                    disabled={denyLoading || resolveLoading}
                                >
                                    {resolveLoading ? <CircularProgress size={23} color="inherit" /> : <i class="bx bx-check"></i>}
                                </button>
                                <button
                                    className="btn btn-outline-danger btn-sm collapse-btn"
                                    onClick={handleFeedback}
                                    disabled={denyLoading || resolveLoading}
                                >
                                    <i class="bx bx-x"></i>
                                </button>
                            </>
                            :
                            <div></div>
                    }
                </td>
            </tr>
            <tr style={expanded ? {} : { display: "none" }}>
                <td colSpan={7}>
                    <div className="container-fluid">
                        <div className="expandableDiv">
                            <div className="left">
                                <table className="table table-borderless">
                                    <tr>
                                        <th>Created At&nbsp;:&nbsp;</th>
                                        <td>{ new Date(item.createdAt).toString()}</td>
                                    </tr>
                                    <tr>
                                        <th>Complaint&nbsp;:&nbsp;</th>
                                        <td>{item.complainDesc}</td>
                                    </tr>
                                    {
                                        complaintType == 'Maintenance' ?
                                            <>
                                                <tr>
                                                    <th>For:</th>
                                                    <td>{forDatas}</td>
                                                </tr>
                                                <tr>
                                                    <th>Available Time&nbsp;:&nbsp;</th>
                                                    <td>{item.availableTime}</td>
                                                </tr>
                                                {item.availableTime === "cac" ? (
                                                    <tr>
                                                        <th>Phone No&nbsp;:&nbsp;</th>
                                                        <td>{item.phoneno}</td>
                                                    </tr>
                                                ) : (
                                                    <tr></tr>
                                                )}
                                                <tr>
                                                    <th>Room No:</th>
                                                    <td>{item.room}</td>
                                                </tr>
                                            </> :
                                            complaintType == 'Cleaning' ?
                                                <>
                                                    <tr>
                                                        <th>For:</th>
                                                        <td>{forDatas}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Room No:</th>
                                                        <td>{item.room}</td>
                                                    </tr>
                                                </> :
                                                complaintType == 'Discipline' ?
                                                    <>
                                                        <tr>
                                                            <th>Regarding:</th>
                                                            <td>{DISCIPLINE[item.category]}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Room No:</th>
                                                            <td>{item.room}</td>
                                                        </tr>
                                                    </> :
                                                    <></>

                                    }
                                    {
                                        item.status == 'deny' ?
                                            <>
                                                <tr>
                                                    <th>Feedback&nbsp;:&nbsp;</th>
                                                    <td>{item.feedback}</td>
                                                </tr>
                                                <tr>
                                                    <th>Denied At&nbsp;:&nbsp;</th>
                                                    <td>{new Date(item.updatedAt).toString()}</td>
                                                </tr>
                                                <tr>
                                                    <th>Denied By&nbsp;:&nbsp;</th>
                                                    <td>{item.empId}</td>
                                                </tr>
                                            </> :
                                            item.status == 'resolve' ?
                                                <>
                                                    <tr>
                                                        <th>Resolved At&nbsp;:&nbsp;</th>
                                                        <td>{item.updatedAt}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Resolved By&nbsp;:&nbsp;</th>
                                                        <td>{item.empId}</td>
                                                    </tr>
                                                </> : <></>
                                    }
                                </table>
                                <div
                                    className="feedbackDiv row"
                                    style={showFeedback ? {} : { display: "none" }}
                                >
                                    <div className="input col-8">
                                        {showFeedbackError ? (
                                            <TextField
                                                value={feedback}
                                                onChange={(e) => {
                                                    if (showFeedbackError) {
                                                        setShowFeedbackError(false);
                                                    }
                                                    setFeedback(e.target.value);
                                                }}
                                                id="outlined-basic"
                                                label="Please enter a Feedback"
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                error
                                            />
                                        ) : (
                                            <TextField
                                                value={feedback}
                                                onChange={(e) => {
                                                    setFeedback(e.target.value);
                                                }}
                                                id="outlined-basic"
                                                label="Enter a Feedback"
                                                variant="outlined"
                                                size="small"
                                                disabled={denyLoading}
                                                fullWidth
                                            />
                                        )}
                                    </div>
                                    <div className="denyBtn col-4">
                                        <Button
                                            variant="contained"
                                            color="error"
                                            endIcon={<SendIcon />}
                                            size="small"
                                            onClick={handleDeny}
                                        >
                                            {denyLoading ? <CircularProgress size={23} color="inherit" /> : ' Deny '}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    );
}

export default StudentHistoryTable;