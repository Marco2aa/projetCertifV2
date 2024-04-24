import React from 'react'

import BuyCrypto from '../Components/BuyCrypto/BuyCrypto'

const Buy = () => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%"
        }}
        >
            <BuyCrypto />
            {/* <BuyLayout>
                <SellForm />
            </BuyLayout> */}

        </div>
    )
}

export default Buy
