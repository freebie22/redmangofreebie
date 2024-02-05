import React from 'react'
import { CartPickUpDetails, CartSummary } from '../Components/Page/Cart'
import { withAuth } from '../HOC'

function ShoppingCart() {
  return (
    <div className="row w-100" style={{marginTop: "10px"}}>
        <div className="col-lg-6 col-md-12 col-12" style={{fontWeight: 300}}>
            <CartSummary></CartSummary>
        </div>
        <div className="col-lg-6 col-12 p-4">
          <CartPickUpDetails></CartPickUpDetails>
        </div>
    </div>
  )
}

export default withAuth(ShoppingCart)