module.exports = {
    //httpkey: 'a97895ea-96b3-4645-b7b2-3cb9c02de0f2',
    //httpsecret: 'A463C43A23214D470D712311D88D3CEB',
    // passphrase: '88888888',
    urlHost: 'https://www.okex.com',
    websocekHost: 'wss://real.okex.com:10442/ws/v3',
    // wssecret: 'A463C43A23214D470D712311D88D3CEB',
    channel_depth: 'spot/depth',
    channel_ticker: 'spot/ticker',
    channel_order: "spot/order",
    channel_trade: "spot/trade",
    channel_candle: "spot/candle",
    //instrument_id : "ZIL-USDT",
    currency: 'ETM',
    SendDepTime: 800,
    orderType: {
        limitOrder: 'A',
        marketOrder: 'B',
        batchOrder: 'C',
        iceOrder: 'D',
        autoMaker: 'E',
        onlyMaker: 'F'
    }
};
