import { useEffect, useState } from 'react';

// FlashMessage component to display success or error messages.
const FlashMessage = ({ flash }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!flash.success && !flash.error) return null;
    if (!visible) return null;

    return (
        <div
            className={`${
                flash.success
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
            } mb-4 rounded border p-4`}
        >
            <p>{flash.success || flash.error}</p>
        </div>
    );
};

export default FlashMessage;
