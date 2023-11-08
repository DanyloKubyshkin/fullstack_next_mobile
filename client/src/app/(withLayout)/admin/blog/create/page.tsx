'use client';

import Form from "@/components/Forms/Form";
import FormInput from "@/components/Forms/FormInput";
import FormTextArea from "@/components/Forms/FormTextArea";
import FBreadCrumb from "@/components/UI/FBreadCrumb";
import { useAddBlogMutation } from "@/redux/api/blogApi";
import { Button, Col, Row, message } from "antd";
import { useRouter } from "next/navigation";

const CreateAdminPage = () => {
    const base = 'admin';
    const router = useRouter();
    const [addBlog] = useAddBlogMutation();

    const handleOnSubmit = async (values: any) => {
        try {
            const res = await addBlog({ ...values });
            if (res) {
                message.success("Successfully Blog Created !");
                router.push('/admin/blog')
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <>
            <FBreadCrumb items={[
                { label: `${base}`, link: `/${base}` },
                { label: `blog`, link: `/${base}/blog` }

            ]} />
            <h5 className='p-2'>Create Blog</h5>
            <Form submitHandler={handleOnSubmit}>
                <div
                    style={{
                        border: "1px solid #d9d9d9",
                        borderRadius: "5px",
                        padding: "15px",
                        marginBottom: "10px",
                    }}
                >
                    <Row gutter={{ xs: 24, xl: 8, lg: 8, md: 24 }}>
                        <Col span={8} style={{ margin: "10px 0" }}>
                            <FormInput
                                name="title"
                                type="text"
                                size="large"
                                label="Name"
                            />
                        </Col>

                        <Col span={8} style={{ margin: "10px 0" }}>
                            <FormTextArea
                                name="description"
                                label="description"
                            />
                        </Col>
                    </Row>
                </div>
                <Button htmlType="submit" type="primary">submit</Button>
            </Form>
        </>
    )
}

export default CreateAdminPage;