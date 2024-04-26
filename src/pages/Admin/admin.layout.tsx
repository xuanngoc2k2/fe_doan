
interface LayoutProps {
    children?: React.ReactNode;
}
const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            {children}
        </>
    );
}

export default AdminLayout;