import React from 'react'

import BuyCrypto from '../Components/BuyCrypto/BuyCrypto'
import CustomizedTabs from '../Components/StyledTabs'

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
            <CustomizedTabs />
            {/* <BuyCrypto /> */}
            {/* <BuyLayout>
                <SellForm />
            </BuyLayout> */}

        </div>
    )
}

export default Buy
