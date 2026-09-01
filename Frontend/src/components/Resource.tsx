import { ResourceLayout } from '../styles/components.styles';

interface AppLayoutProps {
    children: React.ReactNode;
}

const Resource = ({ children }: AppLayoutProps) => {
    return <ResourceLayout>{children}</ResourceLayout>;
};

export default Resource;
