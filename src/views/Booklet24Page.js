

// core components
import Header from "components/Headers/Header.js";
import NormalHeader from "components/Headers/NormalHeader";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Select from "react-select"
import { fetchProcessData } from "helper/Booklet24Page_helper";
import { toast } from "react-toastify";
import { Button, Card, CardHeader, Container, Row } from "reactstrap";
import { scanFiles } from "helper/Booklet24Page_helper";
import { refreshScanner } from "helper/Booklet24Page_helper";

const Booklet24Page = () => {
    const [count, setCount] = useState(true)
    const [data, setData] = useState([]);
    const [scanning, setScanning] = useState(false);

    const getScanData = async () => {
        try {
            const data = await fetchProcessData();
            if (data?.result?.success) {
                setData(data?.result?.data);
            }
        } catch (error) {
            console.log(error);
            toast.error("something went wrong");
            setScanning(false);

        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (scanning) {
                getScanData();
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [scanning]);

    const handleStart = async () => {
        try {
            setScanning(true);
            const result = await scanFiles();
        } catch (error) {
            console.log(error);
            toast.error("Error in starting");
        } finally {
            setScanning(false);
        }
    };

    const handleRefresh = () => {
        try {
            refreshScanner();
        } catch (error) {
            console.log(error)
            toast.error("Error in Refresh")
        }
    }

    return (
        <>
            <NormalHeader />
            <Container className="mt--7" fluid>
                {/* Table */}
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <div className="d-flex justify-content-between">
                                    <h1 className="mt-2">24 Page Booklet</h1>
                                </div>
                            </CardHeader>
                            <div className=" head">
                                <div className="table-main">
                                    <table className=" ">
                                        <thead>
                                            <tr className="JobQueueTableTr">
                                                <th className="JobQueueTableTh">Index Number</th>
                                                <th className="JobQueueTableTh">Graph 1</th>
                                                <th className="JobQueueTableTh">Graph 2</th>
                                                <th className="JobQueueTableTh">Graph 3</th>
                                                <th className="JobQueueTableTh">Graph 4</th>
                                                <th className="JobQueueTableTh">Exam Type</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.map((item, index) => (
                                                <tr className="JobQueueTableTr" key={index}>
                                                    {Object.values(item).map((value, i) => (
                                                        <td key={i}>{value}</td>
                                                    ))}
                                                </tr>
                                            ))}

                                            {[...Array(20).keys()].map(i => (
                                                <tr className="JobQueueTableTr" key={i}>
                                                    {[...Array(6).keys()].map(i => (
                                                        <td key={i}>  </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="functions mt-2 d-flex justify-content-end">
                                    <Button className="" color="success" type="button" onClick={handleStart}>
                                        Start
                                    </Button>
                                    <Button className="" color="warning" type="button" onClick={handleRefresh}>
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </Row>

            </Container>
        </>
    );
};

export default Booklet24Page;


