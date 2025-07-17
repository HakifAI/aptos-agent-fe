"use client"
import React from 'react';
import Copy from '@/components/ui/copy';
import TokenSwapIcon from '@/components/icons/token-swap-icon';
import HakifiBrandIcon from '@/components/icons/hakifi-brand-icon';
import GasStationIcon from '@/components/icons/gas-station-icon';
import GasStationFilledIcon from '@/components/icons/gas-station-filled-icon';
import Link from 'next/link';
import { EXPLORER_APTOSLABS_URL } from '@/constants/configs';

type Props = {
    error?: string;
    message?: string;
    transactionHash?: string;
    fromAddress?: string;
    toAddress?: string;
    amount?: string;
    assetType?: string;
    tokenName?: string;
    symbol?: string;
    gasUsed?: string;
    gasFee?: {
        gasUsed: number;
        gasUnitPrice: number;
        gasFeeInOctas: number;
        gasFeeInAPT: string;
        gasFeeFormatted: string;
    }
}


const TransferCard = (props: Props) => {
    return <div className="border border-blue-90 rounded-sm p-5 md:p-6 w-fit max-w-full">
        <div className="flex justify-between items-center gap-x-2">
            <div className="flex items-center text-sm p-1 rounded-sm text-blue-60 gap-x-2 border-blue-90 border">
                <Link href={`${EXPLORER_APTOSLABS_URL}/txn/${props.transactionHash}`} target='_blank'>
                    <div className="max-w-32 truncate">
                        {props.transactionHash}
                    </div>
                </Link>
                <Copy value={props.transactionHash ?? ""} size="sm" className='p-0 h-auto text-blue-60' message="Copied transaction hash to clipboard" />
            </div>
            <HakifiBrandIcon className='h-5 text-blue-60' />
        </div>
        <div className='mt-6 flex items-center gap-x-1'>
            <TokenSwapIcon className='w-10 h-10' />
            <div className='text-[32px] font-bold bg-clip-text bg-gradient-to-r from-blue-10 to-blue-50 text-transparent'>{props.amount} {props.symbol}</div>
        </div>
        <div className='mt-4 text-sm'>
            <div className='text-sm text-blue-60'>Sent from</div>
            <div className='break-words max-w-full'>
                {props.fromAddress}{" "}
            </div>
        </div>
        <div className='mt-4 text-sm'>
            <div className='text-sm text-blue-60'>Sent to</div>
            <div className='break-words max-w-full'>
                {props.toAddress}{" "}
            </div>
        </div>
        <div className='mt-6 flex items-center gap-x-2  text-blue-50'>
            <GasStationFilledIcon className='w-6 h-6' />
            <div>{props.gasFee?.gasFeeFormatted}</div>
        </div>
    </div>;
};

export default TransferCard;