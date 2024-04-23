import * as RadixPopover from '@radix-ui/react-popover';
import { ReactNode, forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const Popover = forwardRef(
    (
        {
            trigger,
            content,
            open,
            onOpenChange
        }: {
            trigger: ReactNode;
            content: ReactNode;
            open: boolean;
            onOpenChange: (open: boolean) => void;
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(open);
        useImperativeHandle(
            ref,
            () => {
                return {
                    open() {
                        setIsOpen(true);
                    },
                    close() {
                        setIsOpen(false);
                    }
                };
            },
            []
        );

        useEffect(() => {
            onOpenChange(isOpen);
        }, [isOpen]);

        useEffect(() => {
            setIsOpen(open);
        }, [open]);

        return (
            <RadixPopover.Root open={isOpen} onOpenChange={setIsOpen}>
                <RadixPopover.Trigger>{trigger}</RadixPopover.Trigger>
                <RadixPopover.Anchor />
                <RadixPopover.Portal>
                    <RadixPopover.Content className="overflow-visible outline-none">
                        {content}
                    </RadixPopover.Content>
                </RadixPopover.Portal>
            </RadixPopover.Root>
        );
    }
);

export default Popover;
