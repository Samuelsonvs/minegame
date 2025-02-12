import { Button } from "@headlessui/react";

interface RandomButtonProps {
    text: string;
    onClick: () => void;
}

export default function RandomButton({ text, onClick }: RandomButtonProps) {
    return (
        <Button
            onClick={onClick}
            className="inline-flex items-center justify-center cursor-pointer gap-2 rounded-md bg-green-700 py-1.5 px-3 w-full text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-green-600 focus:ring-1 focus:ring-white"
        >
            {text}
        </Button>
    );
}
