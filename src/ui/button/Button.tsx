import { Button } from "@headlessui/react";


interface CustomButtonProps {
    status: boolean;
    startGameText: string
    cashOutText: string
    startGame: () => void;
    cashOut: () => void;
}

export default function CustomButton({
    status,
    startGameText,
    cashOutText,
    startGame,
    cashOut,
}:CustomButtonProps) {
    return (
        <Button
            onClick={status ? cashOut : startGame}
            className="inline-flex items-center justify-center cursor-pointer gap-2 rounded-md bg-green-700 py-1.5 px-3 w-full text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-green-600 data-[open]:bg-green-700 data-[focus]:outline-1 data-[focus]:outline-white"
        >
            {status ? cashOutText : startGameText}
        </Button>
    );
}
