import type { MenuProps } from "antd";
import Link from "next/link";
import { USER_ROLE } from "./role";

export const sidebarItems = (role: string) => {
    const defaultSidebarProps: MenuProps['items'] = [
        {
            label: <Link href={`/dashboard`}>Dashboard</Link>,
            key: `dashboard`
        },
    ]

    const AdminSidebarItems: MenuProps['items'] = [
        ...defaultSidebarProps,
        {
            label: <Link href={`/${role}/`}>Manage Admin</Link>,
            key: `/${role}/manage`
        },
        {
            label: <Link href={`/${role}/appointments`}>Appointmets</Link>,
            key: `/${role}/admin/appointments`
        },
        {
            label: <Link href={`/${role}/customers`}>Customers</Link>,
            key: `/${role}/customers`
        },
        {
            label: <Link href={`/${role}/order`}>Order</Link>,
            key: `/${role}/order`,
        },
        {
            label: <Link href={`/${role}/service-request`}>Services</Link>,
            key: `/${role}/service-request`,
        },
        {
            label: <Link href={`/${role}/blog`}>Blog</Link>,
            key: `/${role}/blog`
        },
        {
            label: <Link href={`/${role}/testimonials`}>Reviews</Link>,
            key: `/${role}/testimonials`
        },
    ]

    const customerItems: MenuProps['items'] = [
        ...defaultSidebarProps,
        {
            label: <Link href={`/${role}/service-request`}>Services</Link>,
            key: `/${role}/service-request`,
        },
        {
            label: <Link href={`/${role}/order`}>My Order</Link>,
            key: `/${role}/order`,
        },
        {
            label: <Link href={`/${role}/appointments`}>Appointment</Link>,
            key: `/${role}/appointment`,
        },
        {
            label: <Link href={`/${role}/testimonials`}>Reviews</Link>,
            key: `/${role}/testimonials`
        },
    ];

    if (role === USER_ROLE.ADMIN || role === USER_ROLE.SUPER_ADMIN) return AdminSidebarItems;
    if (role === USER_ROLE.CUSTOMER) return customerItems;
    else {
        return defaultSidebarProps
    }
}