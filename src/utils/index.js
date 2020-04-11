import { notification } from 'antd';

export const openNotificationWithIcon = (type, desc) => {
    notification[type]({
        message: 'Info',
        description:
            desc
    });
};