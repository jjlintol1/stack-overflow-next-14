import React from 'react'
import { Button } from '@/components/ui/button';

interface IPaginationProps {
    pageNumber: number;
    isNext: boolean;
}

const Pagination = ({
    pageNumber,
    isNext
}: IPaginationProps) => {
    
    if (!isNext && pageNumber === 1) {
        return null;
    }
  return (
    <div className='flex-center mt-10 w-full gap-2'>
        <Button className='light-border-2 btn flex-center min-h-[36px] gap-2 border' disabled={pageNumber === 1}>
            <p className='body-medium text-dark200_light800'>Prev</p>
        </Button>
        <div className='flex-center rounded-md bg-primary-500 px-3.5 py-2'>
            <p className='body-semibold text-light-900'>{pageNumber}</p>
        </div>
        <Button className='light-border-2 btn flex-center min-h-[36px] gap-2 border' disabled={!isNext}>
            <p className='body-medium text-dark200_light800'>Next</p>
        </Button>
    </div>
  )
}

export default Pagination