import React from 'react'
import ProductCardSkeleton from './product-card-skeleton'

interface ProductsSkeletonProps {
    numberOfProducts?: number
}

const ProductsSkeleton = ({ numberOfProducts }: ProductsSkeletonProps) => {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {
            numberOfProducts && 
            Array.from({ length: numberOfProducts }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))
        }
    </div>
  )
}

export default ProductsSkeleton