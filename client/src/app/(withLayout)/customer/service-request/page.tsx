'use client';

import Actionbar from "@/components/UI/ActionBar"
import FBreadCrumb from "@/components/UI/FBreadCrumb"
import FTable from "@/components/UI/FTable"
import { useDebounced } from "@/redux/hooks"
import { Button, Input } from "antd"
import Link from "next/link"
import { useEffect, useState } from "react"
import dayjs from 'dayjs';
import {
    EditOutlined,
    EyeOutlined,
    ReloadOutlined
} from "@ant-design/icons";
import { useDeleteServiceMutation, useServiceQuery, useServicesQuery } from "@/redux/api/serviceApi"
import { truncate } from "@/helpers/truncate"
import PopDelete from "@/components/UI/PopDelete"
import FModal from "@/components/UI/FModal"
import Image from "next/image"

const ServiceRequest = () => {
    const query: Record<string, any> = {};
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [sortBy, setSortBy] = useState<string>("")
    const [sortOrder, setSortOrder] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    query['limit'] = size;
    query['page'] = page;
    query['sortBy'] = sortBy;
    query['sortOrder'] = sortOrder;

    const debouncedTerm = useDebounced({
        searchQuery: searchTerm,
        delay: 600
    })

    if (!!debouncedTerm) {
        query['searchTerm'] = debouncedTerm
    }

    const [deleteService] = useDeleteServiceMutation();

    const onTableChange = (pagination: any, filter: any, sorter: any) => {
        const { order, field } = sorter;
        setSortBy(field as string);
        setSortOrder(order === 'ascend' ? 'asc' : 'desc')
    }

    const onPaginationChange = (page: number, pageSize: number) => {
        setPage(page);
        setSize(pageSize);
    }
    const resetFilters = () => {
        setSortBy("");
        setSearchTerm("");
        setSortOrder("");
    }
    const { data, isLoading } = useServicesQuery({ ...query });
    const services = data?.services?.data;
    const meta = data?.meta;

    const columns = [
        {
            title: 'deviceType',
            dataIndex: 'deviceType',
            key: 'deviceType'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status'
        },
        {
            title: 'issueDescription',
            dataIndex: 'issueDescription',
            key: 'issueDescription',
            render: function (data: any) {
                return data && truncate(data, 30)
            }
        },
        {
            title: 'createdAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: true,
            render: function (data: any) {
                return data && dayjs(data).format('MMM D, YYYY hh:mm A');
            }
        },
        {
            title: 'Action',
            key: 'Action',
            render: function (data: any) {
                return (
                    <div className="d-flex align-items-center">
                        {
                            data?.status === 'ready_for_appointment' &&
                            <>
                                <Link href={'/schedule'}>
                                <Button type='primary' className="bg-info" style={{ margin: "5px 5px" }}>
                                    Get Interview
                                </Button>
                                </Link>
                            </>
                        }
                      
                        {
                            data?.status === 'payment_pending' &&
                            <>
                                <Link href={`/submit-payment/${data.id}`}>
                                    <Button type='primary' className="bg-warning" style={{ margin: "5px 5px" }}>
                                        Pay
                                    </Button>
                                </Link>
                            </>
                        }
                        <Button type='primary' className="bg-primary" style={{ margin: "5px 5px" }} onClick={() => showModal(data.id)}>
                            <EyeOutlined />
                        </Button>
                        <Link href={`/customer/service-request/edit/${data.id}`}>
                            <Button type='primary' className="bg-primary" style={{ margin: "5px 5px" }}>
                                <EditOutlined />
                            </Button>
                        </Link>
                        <PopDelete title="Service Request" fc={() => deleteService(data.id)} />
                    </div>
                )
            }
        },
    ];

    const [skipId, setSkipId] = useState<string>("");
    const [isSkip, setSkip] = useState<boolean>(true);
    const { data: serviceData } = useServiceQuery(skipId, {
        skip: isSkip
    });

    const showModal = (id: string) => {
        setSkipId(id);
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
        if (skipId) {
            setSkip(false)
        }
    }, [skipId]);


    return (
        <>
            <FBreadCrumb items={[{ label: "dashboard", link: `/dashboard` }]} />
            <Actionbar title="Services">
                <Input
                    type='text'
                    size='large'
                    placeholder='Search...'
                    style={{ width: "35%" }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div>
                    {(!!sortBy || !!sortOrder || !!searchTerm) && (
                        <Button type="primary" onClick={resetFilters} style={{ margin: '0px 5px' }}>
                            <ReloadOutlined />
                        </Button>
                    )}
                    <Link href="/get-appointment">
                        <Button type='primary' className="bg-primary">Get Appointment</Button>
                    </Link>
                </div>
            </Actionbar>

            <div style={{ marginTop: '10px' }}>
                <FTable
                    loading={isLoading}
                    columns={columns}
                    dataSource={services}
                    onPaginationChange={onPaginationChange}
                    onTableChange={onTableChange}
                    showPagination={true}
                    pageSize={size}
                    showSizeChanger={true}
                    totalPages={meta?.total}

                />
            </div>
            <>
                <FModal title="Service" isModalOpen={isModalOpen} handleCancel={handleCancel} handleOk={handleOk}>
                    {
                        serviceData &&

                        <div className="card">
                            <div className="card-header py-2">
                                <h5 className="m-0">Device Type : {serviceData?.deviceType}</h5>
                                <p className="mb-0">AppointMent Date : {dayjs(serviceData?.appointment_date).format('MMM D, YYYY hh:mm A')}</p>
                            </div>
                            <div className="p-2">
                                <p className="mb-0 py-1">Device Issue : {serviceData?.deviceIssue}</p>
                                <p className="mb-0 py-1">Description : {serviceData?.issueDescription}</p>
                                <p className="mb-0 py-1">Technigniacl : {serviceData?.technician}</p>
                                <p className="mb-0 py-1">Status : {serviceData?.status}</p>
                                <p className="mb-0 py-1">Is paid : {serviceData?.isPaid}</p>
                                <p className="mb-0 py-1">is Ready : {serviceData?.isReady}</p>
                                <p className="mb-0 py-1">isFixed : {serviceData?.isFixed}</p>
                            </div>
                            {serviceData.img && <Image src={serviceData?.img} alt={serviceData?.deviceIssue} width={150} height={100} />}
                        </div>
                    }
                </FModal>
            </>
        </>
    )
}

export default ServiceRequest